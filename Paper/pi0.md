---
type: paper
tags:
  - VLA
  - VLM
  - Diffusion
  - algorithm
  - math
  - code/python
  - EmbodiedAI
  - Robot
  - ComputerVision
  - DeepLearning
publish: arxiv preprint
pdf: "[[2410.24164v3.pdf]]"
rate: 🌟🌟🌟🌟
done: false
---
> [!note]- paper
![[2410.24164v3.pdf]]

Motivation:
1. Embodiment数据稀缺: 使用[[2410.24164v3.pdf#page=2&selection=161,9,162,48|pretrained VLM]]以获取先验知识. 使用corss-embodiment数据集
2. 模型架构泛化性: 使用[[2410.24164v3.pdf#page=3&selection=1,41,7,32|cross-embodiment training]], 将来自多个不同机器人的数据合并到一个模型中
3. 给出一个更加高效的训练策略: 在[[2410.24164v3.pdf#page=3&selection=53,16,54,4|10000h+的机器人数据集中pretrain]], [[2410.24164v3.pdf#page=3&selection=54,11,57,22|然后针对特殊的任务进行finetune]]

pipeline:
![[2410.24164v3.pdf#page=1&rect=57,297,550,568|2410.24164v3_pi0, p.1]]
但是核心的pipeline只有:
![[2410.24164v3.pdf#page=4&rect=47,587,578,751]]

Training的代码的架构:
```mermaid
graph TD

a["VLM Backbone<br>(PaliGemma 2B)"]
b["Action Expert<br>(Gemma 300M)"]
c["Action Denosier<br>(Flow Matching)"]

d[(Dataset)]
e(["images<br>(wrist(1 or 2), third-party)"])
f(["language instruct<br>(tokenized by PaliGemma Tokenizer)"])
i(["Action<br>(Expert Action, using for compute loss)"])
g(["robot ego state"])
oooo(["noise"])

h((concat))
k(("\-"))

l[["Flow Matching Loss"]]
m[["Flow Matching<br>Vector Field"]]
n((MSE Loss))

d-->|Sample Batch|e
d-->|Sample Batch|f
d-->|Sample Batch|i
d-->|Sample Batch|g

subgraph forward
	e-->h
	f-->h
	h-->|embed|a
	oooo-->b
	a-->|"Transformer Forward<br>-> hidden state"|b
	g-->b
	b-->|"Transformer Forward<br>-> hidden state"|c
	
	c-->m
	i-->k
	oooo-->k
	k-->n
	m-->n
	n-->l
end
l-->bbbb((Backward))
```

Inference时的架构:
```mermaid
graph TD

a[(Observation)]

b(["images<br>(wrist images(1 or 2), and third-party image)"])
c(["Language Instruct<br>(tokenized by PaliGemma Tokenizer)"])
d(["Robot Ego State"])

e["VLM Backbone<br>(PaliGemma 2B)"]
f["Action Expert<br>(Gemma 300M)"]
g["Flow Matching Vector Field"]

h((concat))

j([noise])
k(["Denoising action<br>A<sub>k</sub><sup>1-t</sup>"])
l[["Denoised Actions"]]

a-->b
a-->c
a-->d

subgraph SampleAction
    b-->h
    c-->h
    d-->f
    h-->|embed|e
    e-->|forward<br>-> hidden state|f
	
	j-->f
    subgraph WhileLoop
	    f-->|forward<br>-> hidden state|g
	    g-->k
	    k-->f
	end
	k-->l
end
```

metrics:

