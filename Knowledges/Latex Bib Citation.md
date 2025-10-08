---
type: skills
tags:
  - code/latex
done: true
---
# bib citation

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
