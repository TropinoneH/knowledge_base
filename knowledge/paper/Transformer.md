---
tags:
  - tutorial
  - LLM
  - paper
  - DL
aliases:
  - Attention is all you need
---
this refer to [d2l](https://d2l.ai/)

the paper is: [Attention is all you need](https://arxiv.org/abs/1706.03762)

所有 #LLM 标签的文章, 基于本文. Transformer是LLM的基础架构, 多个Transformer拼接, 加上其他一些模块, 即可组成LLM
## Background

如果使用不同大小的数据, 那么对数据的处理可能变得困难.

考虑数据库:
- 设计一个操作q, operator on (k, v) pairs
- 根据数据库的内容, 相同的query可能找到不同的答案
- 在大型状态空间上的操作(代码执行)可能变得简单
- 无需压缩或者简化数据库

使用[[torch]]训练
## 定义

$$
\mathcal D={(k_1,v_1), \cdots, (k_m, v_m)}
$$
$$
\mathbf{Attention}(q,\mathcal D)=\sum_{i=1}^m\alpha(q, k_i)v_i
$$

where $q,k_i\in\mathbb R, i=1,\dots,m$ are scalar attention weights.

```python
import torch
import utils

attention_weights = torch.eye(10).reshape((1, 1, 10, 10))
utils.show_heatmaps(attention_weights, x_label="Keys", y_label="Queries")
```

Some common kernels for attention pooling are:

$$
\alpha(q,k)=\exp\left(-\frac{1}{2}||q-k||^2\right)
$$
$$
\alpha(q,k)=1\text{ if }||q-k||\leq1
$$
$$
\alpha(q,k)=\max(0,1-||q-k||^2)
$$

## Attention Pooling via Nadaraya-Watson Regression

define some training data. In the following we use the dependency
$$
y_i=2\sin(x_i)+x_i+\epsilon_i
$$

```python
def f(val):
    return 2 * torch.sin(val) + val

n = 40
x_train, _ = torch.sort(torch.rand(n) * 5)
y_train = f(x_train) + torch.randn(n)
x_val = torch.arange(0, 5, 0.1)
y_val = f(x_val)

def nadaraya_watson(x_train, y_train, x_val, kernel):
    dists = x_train.reshape((-1, 1)) - x_val.reshape((1, -1))
    # Each column/row corresponds to each query/key
    k = kernel(dists).type(torch.float32)
    attention_w = k / k.sum(0)
    y_hat = y_train @ attention_w
    return y_hat, attention_w

def plot(x_train, y_train, x_val, y_val, kernels, names, attention=False):
    fig, axes = plt.subplots(1, 4, sharey=True, figsize=(12, 3))
    for kernel, name, ax in zip(kernels, names, axes):
        y_hat, attention_w = nadaraya_watson(x_train, y_train, x_val, kernel)
        if attention:
            pcm = ax.imshow(attention_w.detach().numpy(), cmap='Reds')
        else:
            ax.plot(x_val, y_hat)
            ax.plot(x_val, y_val, 'm--')
            ax.plot(x_train, y_train, 'o', alpha=0.5);
        ax.set_xlabel(name)
        if not attention:
            ax.legend(['y_hat', 'y'])
    if attention:
        fig.colorbar(pcm, ax=axes, shrink=0.7)

plot(x_train, y_train, x_val, y_val, kernels, names)

plot(x_train, y_train, x_val, y_val, kernels, names, attention=True)
```

## Adapting Attention Pooling

we can replace the Gaussian kernel with one of a different width.

use $\alpha(q,k)=\exp(-\frac{1}{2\sigma^2}||q-k||^2)$

```python
sigmas = (0.1, 0.2, 0.5, 1)
names = ['Sigma ' + str(sigma) for sigma in sigmas]

def gaussian_with_width(sigma):
    return (lambda x: torch.exp(-x**2 / (2*sigma**2)))

kernels = [gaussian_with_width(sigma) for sigma in sigmas]
plot(x_train, y_train, x_val, y_val, kernels, names)
```

## Dot product attention

review the attention function from the Gaussian kernel:
$$
\alpha(q,k_i)=-\frac12||q-k_i||^2=q^Tk_i-\frac12||k_i||^2-\frac12||q||^2
$$

assume that all the elements of the query $q\in\mathbb R^d$ and the key $k_i\in\mathbb R^d$ are independent and are identically drawn random variables with zero mean and unit variance. The dot product between both vectors has zero mean and a variance of $d$

then, we arrive at the first commonly used attention function that is used:
$$
a(q,k_i)=\frac{q^Tk_i}{\sqrt{d}}
$$

and use softmax to normalize:
$$
\alpha(q,k_i)\mathbf{softmax}(a(q,k_i))=\frac{\exp\left(\frac{q^Tk_i}{\sqrt{d}}\right)}{\sum_{j=1}\exp\left(\frac{q^Tk_j}{\sqrt{d}}\right)}
$$

### Masked Softmax Operation

Since we need to be able to deal with sequences of different length, it is necessary to pad with dummy tokens for shorter sequences.

Since we do not want blanks in our attention model, we simply need to limit $\sum_{i=1}^n\alpha(a,k_i)v_i$ to $\sum_{i=1}^n\alpha(a,k_i)v_i$, for however long, $l\leq n$


```python
import math

import torch
from torch import nn


def masked_softmax(X, valid_lens):
    """Perform softmax operation by masking elements on the last axis."""

    # `X`: 3D tensor, `valid_lens`: 1D or 2D tensor
    def _sequence_mask(X: torch.Tensor, valid_lens, value=0):
        maxlen = X.size(1)
        mask = torch.arange(maxlen, dtype=torch.float32, device=X.device)[None, :] < valid_lens[:, None]
        X[~mask] = value
        return X

    if valid_lens is None:
        return nn.functional.softmax(X, dim=-1)
    else:
        shape = X.shape
        if valid_lens.dim() == 1:
            valid_lens = torch.repeat_interleave(valid_lens, shape[1])
        else:
            valid_lens = valid_lens.reshape(-1)
        X = _sequence_mask(X.reshape(-1, shape[-1]), valid_lens, value=-1e6)
        return nn.functional.softmax(X.reshape(shape), dim=-1)

masked_softmax(torch.rand(2, 2, 4), torch.tensor([2, 3]))

masked_softmax(torch.rand(2, 2, 4), torch.tensor([[1, 3], [2, 4]]))
```

## Batch Matrix Multiply

when we have mini-batches of queries and keys, we can compute the dot products of all the queries and keys in the mini-batch simultaneously using matrix multiplication.
$$
Q=[Q_1,\cdots,Q_n]\in\mathbb R^{n\times a\times b}
$$
$$
K=[K_1,\cdots,K_n]\in\mathbb R^{n\times b\times c}
$$
$$
\mathbf{BMM}(Q,K)=[Q_1K_1,\cdots,Q_nK_n] \in \mathbb R^{n\times a\times c}
$$

```python
Q = torch.ones((2, 3, 4))
K = torch.ones((2, 4, 5))
assert torch.bmm(Q, K).shape == (2, 3, 5)
```
### Scaled Dot Product Attention

use algorithm below to computer attention score.

$$
\mathbf{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V\in\mathbb R^{n\times v}
$$

the reason why divided by $\sqrt d$ is just because it performs better in practice.

```python
class DotProductAttention(nn.Module):
    """Scaled dot product attention."""
    def __init__(self, dropout):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        self.attention_weights = None
    
    def forward(self, queries, keys, values, valid_lens=None):
        """
        :param queries: (batch_size, num_queries, d) 
        :param keys:  (batch_size, num_key_value_pairs, d)
        :param values: (batch_size, num_key_value_pairs, v)
        :param valid_lens: (batch_size, ) or (batch_size, num_queries)
        :return: the score of similarity
        """
        d = queries.shape[-1]
        # Swap the last two dimensions of keys with keys.transpose(1, 2)
        scores = torch.bmm(queries, keys.transpose(1, 2)) / math.sqrt(d)
        self.attention_weights = masked_softmax(scores, valid_lens)
        return torch.bmm(self.dropout(self.attention_weights), values)
```

Assume that we have a mini-batch size of 2, a total of 10 keys and values, and that the dimension of the values is 4.

```python
queries = torch.normal(0, 1, (2, 1, 2))
keys = torch.normal(0, 1, (2, 10, 2))
values = torch.normal(0, 1, (2, 10, 4))
valid_lens = torch.tensor([4, 6])
attention = DotProductAttention(dropout=0.5)
attention.eval()
assert attention(queries, keys, values, valid_lens).shape == (2, 1, 4)
```

check whether the attention weights actually vanish(消失) for anything beyond the forth and sixth respectively

```python
utils.show_heatmaps(attention.attention_weights.reshape(1, 1, 2, 10), x_label="Keys", y_label="Queries")
```

### Additive Attention

when queries $q$ and keys $k$ are vectors of different dimensions, we can either use a matrix to address the mismatch via $q^TMk$, or we can use additive attention as scoring function.

$$\begin{matrix}q\in\mathbb R^q\\
k\in\mathbb R^k\\
a(q,k)=w_v^T\tanh(W_qq+W_kk)\in\mathbb R\end{matrix}$$

where $W_q\in\mathbb R^{h\times q}$, $W_k\in\mathbb R^{h\times k}$, and $w_v\in\mathbb R^{h}$

```python
class AdditiveAttention(nn.Module):
    """Additive Attention"""
    def __init__(self, num_hiddens, dropout, **kwargs):
        super().__init__()
        self.W_k = nn.LazyLinear(num_hiddens, bias=False)
        self.W_q = nn.LazyLinear(num_hiddens, bias=False)
        self.w_v = nn.LazyLinear(1, bias=False)
        self.dropout = nn.Dropout(dropout)
        
        self.attention_weights = None
        
    def forward(self, queries, keys, values, valid_lens):
        queries, keys = self.W_q(queries), self.W_k(keys)
        features = queries.unsqueeze(2) + keys.unsqueeze(1)
        features = torch.tanh(features)
        scores = self.w_v(features).squeeze(-1)
        self.attention_weights = masked_softmax(scores, valid_lens)
        
        return torch.bmm(self.dropout(self.attention_weights), values)
```

we pick queries, keys and values of size (2,1,20), (2,10,2) and (2,10,4) respectively.

```python
queries = torch.normal(0, 1, (2, 1, 20))
keys = torch.normal(0, 1, (2, 10, 2))
values = torch.normal(0, 1, (2, 10, 4))
valid_lens = torch.tensor([2, 6])

attention = AdditiveAttention(num_hiddens=8, dropout=0.1)
attention.eval()
assert attention(queries, keys, values, valid_lens).shape == (2, 1, 4)

utils.show_heatmaps(attention.attention_weights.reshape(1, 1, 2, 10), x_label="Keys", y_label="Queries")
```

## Bahdanau Attention Mechanism

原因: 原始的翻译模型是将整个输入序列编码为一个固定长度的向量，然后解码器将这个向量转换为输出序列。这种方法的问题是，如果输入序列很长，那么编码器可能会丢失一些信息。为了解决这个问题，Bahdanau等人提出了注意力机制。

这种注意力机制的关键思想是, 不是保留最终的序列信息，而是动态更新每个部分.

如:
$$
c_{t'}=\sum_{t=1}^T\alpha(s_{t'-1},h_t)h_t
$$

用$s_{t'-1}$是已经生成的文本作为queries, 而$h_t$是原始文本(隐变量)同时作为key和value. $c_{t'}$用于生成$s_{t'}$

```python
import torch
from torch import nn

def masked_softmax(X, valid_lens):
    """Perform softmax operation by masking elements on the last axis."""

    # `X`: 3D tensor, `valid_lens`: 1D or 2D tensor
    def _sequence_mask(X: torch.Tensor, valid_lens, value=0):
        maxlen = X.size(1)
        mask = torch.arange(maxlen, dtype=torch.float32, device=X.device)[None, :] < valid_lens[:, None]
        X[~mask] = value
        return X

    if valid_lens is None:
        return nn.functional.softmax(X, dim=-1)
    else:
        shape = X.shape
        if valid_lens.dim() == 1:
            valid_lens = torch.repeat_interleave(valid_lens, shape[1])
        else:
            valid_lens = valid_lens.reshape(-1)
        X = _sequence_mask(X.reshape(-1, shape[-1]), valid_lens, value=-1e6)
        return nn.functional.softmax(X.reshape(shape), dim=-1)


class AdditiveAttention(nn.Module):
    """Additive Attention"""

    def __init__(self, num_hiddens, dropout, **kwargs):
        super().__init__()
        self.W_k = nn.LazyLinear(num_hiddens, bias=False)
        self.W_q = nn.LazyLinear(num_hiddens, bias=False)
        self.w_v = nn.LazyLinear(1, bias=False)
        self.dropout = nn.Dropout(dropout)

        self.attention_weights = None

    def forward(self, queries, keys, values, valid_lens):
        queries, keys = self.W_q(queries), self.W_k(keys)
        features = queries.unsqueeze(2) + keys.unsqueeze(1)
        features = torch.tanh(features)
        scores = self.w_v(features).squeeze(-1)
        self.attention_weights = masked_softmax(scores, valid_lens)

        return torch.bmm(self.dropout(self.attention_weights), values)

class Encoder(nn.Module):
    """The base encoder interface for the encoder--decoder architecture."""

    def __init__(self):
        super().__init__()

    # Later there can be additional arguments (e.g., length excluding padding)
    def forward(self, X, *args):
        raise NotImplementedError


class Seq2SeqEncoder(Encoder):  #@save
    """The RNN encoder for sequence-to-sequence learning."""

    def __init__(self, vocab_size, embed_size, num_hiddens, num_layers,
                 dropout=0):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.rnn = nn.GRU(embed_size, num_hiddens, num_layers, dropout=dropout)
        self.apply(utils.init_seq2seq)

    def forward(self, X, *args):
        # X shape: (batch_size, num_steps)
        embs = self.embedding(X.t().type(torch.int64))
        # embs shape: (num_steps, batch_size, embed_size)
        outputs, state = self.rnn(embs)
        # outputs shape: (num_steps, batch_size, num_hiddens)
        # state shape: (num_layers, batch_size, num_hiddens)
        return outputs, state

class Decoder(nn.Module):
    def __init__(self):
        super().__init__()

    def init_state(self, enc_all_outputs, enc_valid_lens):
        raise NotImplementedError

    def forward(self, X, state):
        raise NotImplementedError


class AttentionDecoder(Decoder):
    def __init(self):
        super().__init__()

    @property
    def attention_weights(self):
        raise NotImplementedError


class Seq2seqAttentionDecoder(AttentionDecoder):
    def __init__(self, vocab_size, embed_size, num_hiddens, num_layers, dropout=0):
        super().__init__()

        self.attention = AdditiveAttention(num_hiddens, dropout)
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.rnn = nn.GRU(embed_size + num_hiddens, num_hiddens, num_layers, dropout=dropout)
        self.dense = nn.LazyLinear(vocab_size)
        self.apply(utils.init_seq2seq)

        self._attention_weights = []

    def init_state(self, enc_all_outputs, enc_valid_lens):
        outputs, hidden_state = enc_all_outputs
        return outputs.permute(1, 0, 2), hidden_state, enc_valid_lens

    def forward(self, X, state):
        enc_outputs, hidden_state, enc_valid_lens = state
        X = self.embedding(X).permute(1, 0, 2)
        outputs, self._attention_weights = [], []
        for x in X:
            query = torch.unsqueeze(hidden_state[-1], dim=1)
            context = self.attention(query, enc_outputs, enc_outputs, enc_valid_lens)
            x = torch.cat((context, torch.unsqueeze(x, dim=1)), dim=-1)
            out, hidden_state = self.rnn(x.permute(1, 0, 2), hidden_state)
            outputs.append(out)
            self._attention_weights.append(self.attention.attention_weights)

        outputs = self.dense(torch.cat(outputs, dim=0))
        return outputs.permute(1, 0, 2), [enc_outputs, hidden_state, enc_valid_lens]

    @property
    def attention_weights(self):
        return self._attention_weights

# Test
vocab_size, embed_size, num_hiddens, num_layers = 10, 8, 16, 2
batch_size, num_steps = 4, 7
encoder = Seq2SeqEncoder(vocab_size, embed_size, num_hiddens, num_layers)
decoder = Seq2seqAttentionDecoder(vocab_size, embed_size, num_hiddens, num_layers)

X = torch.zeros((batch_size, num_steps), dtype=torch.long)

state = decoder.init_state(encoder(X), None)
output, state = decoder(X, state)
assert output.shape == (batch_size, num_steps, vocab_size)
assert state[0].shape == (batch_size, num_steps, num_hiddens)
assert state[1][0].shape == (batch_size, num_hiddens)
```

## Multi-Head Attention

sometimes we may want our model to combine knowledge from different behaviors of same attention mechanism, such as capturing dependencies of various ranges(e.g. shorter-range vs. longer-range)
### Model

Given a query $q\in\mathbb R^{d_q}$, a key $k\in\mathbb R^{d_k}$, and value $v\in\mathbb R^{d_v}$. each attention head $h_i, i=1,2,\dots, h$ is computed as

$$
h_i=f(W_i^{(q)}q,W_i^{(k)}k,W_i^{(v)}v)\in\mathbb R^{p_v}
$$

where $W_i^{(q)}\in\mathbb R^{p_q\times d_q}$, $W_i^{(k)}\in\mathbb R^{p_k\times d_k}$, $W_i^{(v)}\in\mathbb R^{p_v\times d_v}$ are learnable parameters and $f$ is attention pooling, such as additive attention and scaled dot product attention.

the output of multi head attention is another linear transformer via $W_o\in\mathbb R^{p_o\times hp_v}$

$$
W_o\left[\begin{matrix}h_1\\ \vdots\\ h_h\end{matrix}\right]\in\mathbb R^{p_o}
$$


```python
import math

import torch
from torch import nn

def masked_softmax(X, valid_lens):
    """Perform softmax operation by masking elements on the last axis."""

    # `X`: 3D tensor, `valid_lens`: 1D or 2D tensor
    def _sequence_mask(X: torch.Tensor, valid_lens, value=0):
        maxlen = X.size(1)
        mask = torch.arange(maxlen, dtype=torch.float32, device=X.device)[None, :] < valid_lens[:, None]
        X[~mask] = value
        return X

    if valid_lens is None:
        return nn.functional.softmax(X, dim=-1)
    else:
        shape = X.shape
        if valid_lens.dim() == 1:
            valid_lens = torch.repeat_interleave(valid_lens, shape[1])
        else:
            valid_lens = valid_lens.reshape(-1)
        X = _sequence_mask(X.reshape(-1, shape[-1]), valid_lens, value=-1e6)
        return nn.functional.softmax(X.reshape(shape), dim=-1)


class DotProductAttention(nn.Module):
    """Scaled dot product attention."""

    def __init__(self, dropout):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        self.attention_weights = None

    def forward(self, queries, keys, values, valid_lens=None):
        """
        :param queries: (batch_size, num_queries, d) 
        :param keys:  (batch_size, num_key_value_pairs, d)
        :param values: (batch_size, num_key_value_pairs, v)
        :param valid_lens: (batch_size, ) or (batch_size, num_queries)
        :return: the score of similarity
        """
        d = queries.shape[-1]
        # Swap the last two dimensions of keys with keys.transpose(1, 2)
        scores = torch.bmm(queries, keys.transpose(1, 2)) / math.sqrt(d)
        self.attention_weights = masked_softmax(scores, valid_lens)
        return torch.bmm(self.dropout(self.attention_weights), values)
```


```python
class MultiHeadAttention(utils.Module):
    def __init__(self, num_hiddens, num_heads, dropout, bias=False, **kwargs):
        super().__init__()
        self.num_heads = num_heads
        self.attention = DotProductAttention(dropout)
        self.W_q = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_k = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_v = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_o = nn.LazyLinear(num_hiddens, bias=bias)

    def transpose_qkv(self, X):
        """Transposition for parallel computation of multiple attention heads."""
        # Shape of input X: (batch_size, no. of queries or key-value pairs,
        # num_hiddens). Shape of output X: (batch_size, no. of queries or
        # key-value pairs, num_heads, num_hiddens / num_heads)
        X = X.reshape(X.shape[0], X.shape[1], self.num_heads, -1)
        # Shape of output X: (batch_size, num_heads, no. of queries or key-value
        # pairs, num_hiddens / num_heads)
        X = X.permute(0, 2, 1, 3)
        # Shape of output: (batch_size * num_heads, no. of queries or key-value
        # pairs, num_hiddens / num_heads)
        return X.reshape(-1, X.shape[2], X.shape[3])

    def transpose_output(self, X):
        """Reverse the operation of transpose_qkv."""
        X = X.reshape(-1, self.num_heads, X.shape[1], X.shape[2])
        X = X.permute(0, 2, 1, 3)
        return X.reshape(X.shape[0], X.shape[1], -1)

    def forward(self, queries, keys, values, valid_lens):
        queries = self.transpose_qkv(self.W_q(queries))
        keys = self.transpose_qkv(self.W_k(keys))
        values = self.transpose_qkv(self.W_v(values))

        if valid_lens is not None:
            valid_lens = torch.repeat_interleave(valid_lens, repeats=self.num_heads, dim=0)

        output = self.attention(queries, keys, values, valid_lens)
        output_concat = self.transpose_output(output)
        return self.W_o(output_concat)

num_hiddens, num_heads = 100, 5
attention = MultiHeadAttention(num_hiddens, num_heads, 0.5)
batch_size, num_queries, num_kvpairs = 2, 4, 6
valid_lens = torch.tensor([3, 2])
X = torch.ones((batch_size, num_queries, num_hiddens))
Y = torch.ones((batch_size, num_kvpairs, num_hiddens))
assert attention(X, Y, Y, valid_lens).shape == (batch_size, num_queries, num_hiddens)
```

## Self Attention

the queries is same as keys and values
$$
y_i=f(x_i, \{(x_1,x_1),\cdots,(x_n,x_n)\})\in\mathbb R^d
$$

```python
import math

import torch
from torch import nn

def masked_softmax(X, valid_lens):
    """Perform softmax operation by masking elements on the last axis."""

    # `X`: 3D tensor, `valid_lens`: 1D or 2D tensor
    def _sequence_mask(X: torch.Tensor, valid_lens, value=0):
        maxlen = X.size(1)
        mask = torch.arange(maxlen, dtype=torch.float32, device=X.device)[None, :] < valid_lens[:, None]
        X[~mask] = value
        return X

    if valid_lens is None:
        return nn.functional.softmax(X, dim=-1)
    else:
        shape = X.shape
        if valid_lens.dim() == 1:
            valid_lens = torch.repeat_interleave(valid_lens, shape[1])
        else:
            valid_lens = valid_lens.reshape(-1)
        X = _sequence_mask(X.reshape(-1, shape[-1]), valid_lens, value=-1e6)
        return nn.functional.softmax(X.reshape(shape), dim=-1)


class DotProductAttention(nn.Module):
    """Scaled dot product attention."""

    def __init__(self, dropout):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        self.attention_weights = None

    def forward(self, queries, keys, values, valid_lens=None):
        """
        :param queries: (batch_size, num_queries, d) 
        :param keys:  (batch_size, num_key_value_pairs, d)
        :param values: (batch_size, num_key_value_pairs, v)
        :param valid_lens: (batch_size, ) or (batch_size, num_queries)
        :return: the score of similarity
        """
        d = queries.shape[-1]
        # Swap the last two dimensions of keys with keys.transpose(1, 2)
        scores = torch.bmm(queries, keys.transpose(1, 2)) / math.sqrt(d)
        self.attention_weights = masked_softmax(scores, valid_lens)
        return torch.bmm(self.dropout(self.attention_weights), values)


class MultiHeadAttention(utils.Module):
    def __init__(self, num_hiddens, num_heads, dropout, bias=False, **kwargs):
        super().__init__()
        self.num_heads = num_heads
        self.attention = DotProductAttention(dropout)
        self.W_q = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_k = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_v = nn.LazyLinear(num_hiddens, bias=bias)
        self.W_o = nn.LazyLinear(num_hiddens, bias=bias)

    def transpose_qkv(self, X):
        """Transposition for parallel computation of multiple attention heads."""
        # Shape of input X: (batch_size, no. of queries or key-value pairs,
        # num_hiddens). Shape of output X: (batch_size, no. of queries or
        # key-value pairs, num_heads, num_hiddens / num_heads)
        X = X.reshape(X.shape[0], X.shape[1], self.num_heads, -1)
        # Shape of output X: (batch_size, num_heads, no. of queries or key-value
        # pairs, num_hiddens / num_heads)
        X = X.permute(0, 2, 1, 3)
        # Shape of output: (batch_size * num_heads, no. of queries or key-value
        # pairs, num_hiddens / num_heads)
        return X.reshape(-1, X.shape[2], X.shape[3])

    def transpose_output(self, X):
        """Reverse the operation of transpose_qkv."""
        X = X.reshape(-1, self.num_heads, X.shape[1], X.shape[2])
        X = X.permute(0, 2, 1, 3)
        return X.reshape(X.shape[0], X.shape[1], -1)

    def forward(self, queries, keys, values, valid_lens):
        queries = self.transpose_qkv(self.W_q(queries))
        keys = self.transpose_qkv(self.W_k(keys))
        values = self.transpose_qkv(self.W_v(values))

        if valid_lens is not None:
            valid_lens = torch.repeat_interleave(valid_lens, repeats=self.num_heads, dim=0)

        output = self.attention(queries, keys, values, valid_lens)
        output_concat = self.transpose_output(output)
        return self.W_o(output_concat)

num_hiddens, num_heads = 100, 5
attention = MultiHeadAttention(num_hiddens, num_heads, 0.5)
batch_size, num_queries, valid_lens = 2, 4, torch.tensor([3, 2])
X = torch.ones(batch_size, num_queries, num_hiddens)
assert attention(X, X, X, valid_lens).shape ==(batch_size, num_queries, num_hiddens)
```

## Positional Encoding

self-attention uses parallel computation, and doesn't preserve the order of the sequence.

$$
p_{i,2j}=\sin\left(\frac{i}{10000^{\frac{2j}{d}}}\right)
$$
$$
p_{i,2j+1}=\cos\left(\frac{i}{10000^{\frac{2j}{d}}}\right)
$$

reason:
- each position has a different position code
- smooth value
- Monotonically decreasing


```python
class PositionalEncoding(nn.Module):
    """positional encoding"""
    def __init__(self, num_hiddens, dropout, max_len=1000):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        
        self.P = torch.zeros(1, max_len, num_hiddens)
        X = torch.arange(max_len, dtype=torch.float32).reshape(-1, 1) / torch.pow(10000, torch.arange(0, num_hiddens, 2, dtype=torch.float32) / num_hiddens)
        self.P[:, :, 0::2] = torch.sin(X)
        self.P[:, :, 1::2] = torch.cos(X)
        
    def forward(self, X: torch.Tensor):
        X = X + self.P[:, :X.shape[1], :].to(X.device)
        return self.dropout(X)

encoding_dim, num_steps = 32, 60
pos_encoding = PositionalEncoding(encoding_dim, 0)
X = pos_encoding(torch.zeros(1, num_steps, encoding_dim))
P = pos_encoding.P[:, :X.shape[1], :]
utils.plot(torch.arange(num_steps), P[0, :, 6:10].T, xlabel="Row (position)", figsize=(6, 2.5), legend=["Col %d" % d for d in torch.arange(6, 10)])
```

### Relative Positional Encoding

for fixed offset $\delta$

denoting $\omega_j=\frac{1}{10000^{\frac{2j}{d}}}$, then

$$
\begin{bmatrix}\cos(\delta\omega_j)&\sin(\delta\omega_j)\\-\sin(\delta\omega_j)&\cos(\delta\omega_j)\end{bmatrix}\begin{bmatrix}p_{i,2j}\\ p_{i,2j+1}\end{bmatrix}=\begin{bmatrix}p_{i+\delta,2j}\\ p_{i+\delta,2j+1}\end{bmatrix}
$$

where the projection matrix $\begin{bmatrix}\cos(\delta\omega_j)&\sin(\delta\omega_j)\\-\sin(\delta\omega_j)&\cos(\delta\omega_j)\end{bmatrix}$ doesn't depend on any position index $i$
