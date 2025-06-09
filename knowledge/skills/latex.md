---
tags:
  - tutorial
  - latex
---
## bib citation

创建文件`<filename>.bib`

在主文件中使用:

```latex
% ...
\usepackage{cite}

\begin{document}
	% ...
	\cite{...}
	% ...
	
		\bibliographystyle{plain}
        \bibliography{<filename>.bib}
\end{document}
```

## include pdf

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