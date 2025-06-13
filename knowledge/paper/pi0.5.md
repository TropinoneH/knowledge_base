---
tags:
  - paper
  - DL
  - LLM
  - EmbodiedAI
  - VLA
aliases:
  - "pi0.5: a Vision-Language-Action Model with Open-World Generalization"
---
# $\pi_{0.5}$

> [!paper]-
> ![[2504.16054v1_pi0.5.pdf]]

设计训练recipe, 以提供breadth knowledge, 使robots在不同级别的抽象层次上泛化

```mermaid
graph TD
    classDef data fill:#f9f,stroke:#333,stroke-width:2px;
    classDef model fill:#ccf,stroke:#333,stroke-width:2px;
    classDef process fill:#cfc,stroke:#333,stroke-width:2px;
    classDef io fill:#f8f8f8,stroke:#333,stroke-width:1px;
    %% 输入数据源
    WebData["Multimodal Web Data <br> (图像、文本、问答、检测)"]:::data
    RobotActionData["Robot Action Data <br> (来自多种机器人)"]:::data
    %% 模型核心
    WebData -- "Co-training" --> Pi05("π₀.₅ Vision-Language-Action Policy"):::model
    RobotActionData -- "Co-training" --> Pi05
    %% 推理流程
    UserPrompt["用户高级指令 <br> 'clean the kitchen'"]:::io
    UserPrompt -- "输入" --> Pi05
    Pi05 -- "1.预测高级子任务" --> Subtask["语义子任务 <br> 'pick up the plate'"]:::process
    Subtask -- "2.作为低级指令" --> Pi05
    Pi05 -- "3.生成低级动作" --> ActionExpert(Action Expert)
    ActionExpert:::model --> RobotAction["机器人动作序列 <br> (连续、高频)"]:::io
    %% 输出
    RobotAction -- "控制" --> Robot(机器人执行)
```

![[Pasted image 20250613172029.png]]