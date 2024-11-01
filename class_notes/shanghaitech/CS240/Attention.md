# Attention

主要组成: Q, K, V

```python
import torch
import torch.nn as nn

class Attention(nn.Module):
    def __init__(self, attention_type='dot', hidden_size=256):
        super(Attention, self).__init__()
        self.attention_type = attention_type
        self.hidden_size = hidden_size

        # Linear layer to transform the query (decoder hidden state)
        self.query = nn.Linear(hidden_size, hidden_size, bias=False)
        # Linear layer to transform the key (encoder hidden state)
        self.key = nn.Linear(hidden_size, hidden_size, bias=False)
        # Linear layer to transform the value (encoder hidden state)
        self.value = nn.Linear(hidden_size, hidden_size, bias=False)

        # Softmax layer to compute the attention weights
        self.softmax = nn.Softmax(dim=-1)

    def forward(self, query, keys, values):
        # Transform the query
        query = self.query(query).unsqueeze(1)
        # Transform the keys
        keys = self.key(keys)
        # Transform the values
        values = self.value(values)

        # Compute the attention weights
        if self.attention_type == 'dot':
            # dot product attention
            attention_weights = torch.bmm(query, keys.transpose(1, 2))
        elif self.attention_type == 'cosine':
            # cosine similarity attention
            query = query / query.norm(dim=-1, keepdim=True)
            keys = keys / keys.norm(dim=-1, keepdim=True)
            attention_weights = torch.bmm(query, keys.transpose(1, 2))
        else:
            raise ValueError(f"Invalid attention type: {self.attention_type}")

        # Normalize the attention weights
        attention_weights = self.softmax(attention_weights)

        # Apply the attention weights to the values to obtain the attended output
        attended_output = torch.bmm(attention_weights, values)

        return attended_output, attention_weights

#To use this attention module, you can pass it the query (decoder hidden state), keys (encoder hidden states), and values (encoder hidden states) 
#as input, and it will return the attended output and the attention weights.
#For example:

# Define the attention module
attention = Attention(attention_type='dot', hidden_size=256)

# Inputs to the attention module
batch_size = 10
hidden_size = 256
sequence_length = 12
query = torch.randn(batch_size, hidden_size)
keys = torch.randn(batch_size, sequence_length, hidden_size)
values = torch.randn(batch_size, sequence_length, hidden_size)

# Compute the attended output and attention weights
attended_output, attention_weights = attention(query, keys, values)
print(attended_output.shape)
print(attention_weights.shape)
```



# Cross Attention

1. 概念
   - Transformer架构中混合两种不同的嵌入序列的注意力机制
   - 两个序列必须具有相同的维度
   - 两个序列可以是不同的模式形态(如, 文本, 声音, 图像)
   - 一个序列作为输入的Q, 定义输出序列的长度, 另一个序列提供输入的K, V
2. 与Self-Attention的比较
   - Cross-Attention的输入来自不同的序列, Self-Attention的输入是同一个序列
3. 算法
   - 计算$seq_1$的$K_{s_1}$, $V_{s_1}$
   - 计算$seq_2$的$Q_{s_2}$
   - 计算注意力矩阵(点乘) $\mathbf{softmax}\left(\frac{Q_{s_2}\cdot K_{s_1}^T}{\sqrt{d}}\right)$
   - 应用Value矩阵$\mathbf{softmax}\left(\frac{Q_{s_2}\cdot K_{s_1}^T}{\sqrt{d}}\right)V_{s_1}$
   - 将计算得出的之加到原始的序列中$\hat{\vec E_i}=\vec E_i+\Delta\vec E_i$