---
type: skills
tags:
  - code/latex
done: true
topic:
 - "[[Latex]]"
---
# include pdf

```latex
\documentclass[12pt]{article}% or something else
\usepackage{pdfpages} % important this
\usepackage{geometry}
\geometry{a4paper, margin=1in}
\usepackage{fancyhdr}
\usepackage{lastpage}
\usepackage{amsmath}
\usepackage{amssymb, stmaryrd}
\usepackage[tikz]{bclogo}
\usepackage{ulem}

\begin{document}
\includepdf[pages=-]{self.pdf}
\includepdf[pages=-]{resume.pdf}
\includepdf[pages=-]{grades.pdf}
\includepdf[pages=-]{rank.pdf}
\end{document}
```
