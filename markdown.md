---
tags:
  - tutorial
  - markdown
---
# Basic Syntax

## Inline Style

this is `code block`

this is ==highlight==

this is ~~delete line~~

this is *italic*

this is **bold**

this is $\text{inline math: }\sum_i\min\limits_{x}ax+b$
## Block

math block:
$$\text{center math block but no break line: }\mathbf y=\mathbf w^\top\mathbf x+\mathbf b\in\mathbb R^n$$

code block:

```python
import os
for file, _, _ in os.walk(os.getcwd()):
	print(file)
```

block quote:

> this is default block quote
> without any theme

> [!tip]
> this is a tip block

> [!info]
> this is a info block

> [!tldr]
> too long; don't read

> [!todo]
> this is a todo block

> [!warning]
> this is a warning block

> [!error]
> this is a error block

> [!success]
> this is a success block

> [!bug]
> this is a bug block

> [!fail]
> this is a fail block

> [!example]
> this is a example block

> [!Custom] Custom Title
> this is a custom block with custom title

block quote with auto collapse:

```markdown
> [!note]- collapse / expand
> use `-` after `[!note]` to make the quote auto collapse
```

> [!note]- collapse / expand
> use `-` after `[!note]` to make the quote auto collapse

## Title

for title, use `#` as indicator:

```markdown
# Title 1
## Title 2
### Title 3
#### Title 4
##### Title 5
###### Title 6
```

## Link

we can link image/URL in markdown.

image:

![web image|50](https://obsidian.md/images/obsidian-logo-gradient.svg)

URL:

[official homepage](https://obsidian.md)

# Mermaid

pie chart:
```mermaid
pie
    title Pie Chart
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 150 
```

flow chart:
```mermaid
graph LR
A[Hard edge] -->B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```

sequence diagrams:
```mermaid
  sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
    Bob->>Alice: Not so good :(
    else is well
    Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
    Bob->>Alice: Thanks for asking
    end
```

Gantt:
```mermaid
%% Example with selection of syntaxes
        gantt
        dateFormat  YYYY-MM-DD
        title Adding GANTT diagram functionality to mermaid
 
        section A section
        Completed task            :done,    des1, 2014-01-06,2014-01-08
        Active task               :active,  des2, 2014-01-09, 3d
        Future task               :         des3, after des2, 5d
        Future task2               :         des4, after des3, 5d
 
        section Critical tasks
        Completed task in the critical line :crit, done, 2014-01-06,24h
        Implement parser and jison          :crit, done, after des1, 2d
        Create tests for parser             :crit, active, 3d
        Future task in critical line        :crit, 5d
        Create tests for renderer           :2d
        Add to mermaid                      :1d
 
        section Documentation
        Describe gantt syntax               :active, a1, after des1, 3d
        Add gantt diagram to demo page      :after a1  , 20h
        Add another diagram to demo page    :doc1, after a1  , 48h
 
        section Last section
        Describe gantt syntax               :after doc1, 3d
        Add gantt diagram to demo page      : 20h
        Add another diagram to demo page    : 48h
```

class diagrams:
```mermaid
classDiagram
      Animal <|-- Duck
      Animal <|-- Fish
      Animal <|-- Zebra
      Animal : +int age
      Animal : +String gender
      Animal: +isMammal()
      Animal: +mate()
      class Duck{
          +String beakColor
          +swim()
          +quack()
      }
      class Fish{
          -int sizeInFeet
          -canEat()
      }
      class Zebra{
          +bool is_wild
          +run()
      }
```

state diagrams:
```mermaid
stateDiagram
    [*] --> Still
    Still --> [*]
 
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

# HTML

we can simple use html element in markdown.

## original element

<div>this is simple div element</div>

<details>
	<summary>this is a summary for details block</summary>
	
	Here is the inner space of details.
	
	Only in read(or preview) mode could open and show this.
	
	No markdown syntax available here, only html syntax

</details>

## element with CSS

<div style="color: cyan; background-color: gray">this is HTML block with style sheet</div>

## Use other framework

you can simple use `<script>` block to import other framework such as [[Vuetify]], [[ElementUI]] or others.