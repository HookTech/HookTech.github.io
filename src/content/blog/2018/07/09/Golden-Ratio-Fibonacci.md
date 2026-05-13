---
title: Golden Ratio & Fibonacci
description: '深入探讨黄金分割与斐波那契数列的数学关系，包含详细的数学推导和证明过程，适合数学爱好者阅读'
pubDate: 2018-07-09T08:43:18
tags:
  - 数学
  - 黄金分割
  - 斐波那契数列
  - 数学证明
  - 线性代数
categories:
  - 数学
---

> 生活有点无聊...记点好玩的

---
### 引子
初中时代知道了Golden Ration，从数学老师那里第一次知道时，感觉很有趣的样子，于是在纸上推啊推，好奇为啥值是0.618呢？后来用换元法最终搞出，那个开心啊<(￣︶￣)>，感觉数学神奇啊

高中时代无聊，有次捣腾Fibonacci数列，都说这是神奇的数列。于是自己看看有没有好玩的性质，于是让前面的数字除以后面的数字，1/1;1/2;/2/3;3/5;/5/8...等等，数值怎么不对，8/13;13/21，我去，好像是0.618！再继续，21/34;34/55，我擦，竟然真的是0.618这货，而且越往后越是Golden Ration！！什么情况，难道两者之间有不可描述的关系？(*ﾟДﾟ*) ，在震惊的同时开始各种推，咳咳，但是以当时的阅历，当然并不知道这里面的水有多深，数学原理是啥...于是不了了之

于是荒废到了工作时代...Times fly and people start to die...

终于有一天，出来混的都还上了...不废话，正题了
### Golden Ration
$$\frac{2}{1 + \sqrt{5}}\approx0.618\quad\Leftrightarrow\quad\frac{1 + \sqrt{5}}{2}\approx 1.618$$
这两货相比大部分人都知道，传说中的黄金分割嘛，为啥起这名儿，也许是因为漂亮的妹子颜值的黄金比吧╮(￣▽￣)╭。也不知道为什么造物主喜欢这样设计，反正只知道整容的都喜欢按这比例动刀...呵呵，说真格的，反正从有机生物到无机结构，很多存在都内含该比例。

至于值的证明，用换元法把定义的等式处理下，可以得到二次方程
$$\varphi = 1 + \frac{1}{\varphi}$$
其中一根就是1.618，开心吧，另一根后面会有伏笔
好了，正题刚刚开始...
### Fibonacci

数列长这样的，大家都懂
$$1,1,2,3,5,8,13,21,34,55,89,144,233,377 $$
等等，不觉得这货增长很快么，那么有多快呢？如果高中的猜测是对的话，后面相邻两数的比值越来越接近黄金比，那么这可是$O(c^{n})$指数级增长啊，1000的话地球都要爆炸了...

为啥这么快呢?
好了，严肃的要开始了，我也要开始还数学债了，非战斗人员可以跳过推导看思想就行
***
Fibonacci数列定义是这样的：
$$\textit{F}_{k + 2}=\textit{F}_{k + 1} + \textit{F}_{k}\\\left\{\textit{F}_{0}=1\right\}\quad\left\{\textit{F}_{1}=1\right\}$$
递推式，怎么搞呢，不是通项式，有办法转化为通项表示吗？这样不就知道后项与前项的关系了吗？

> *注：*
> *1. 后面推导的仅是证明思路中的一种*
> *2. 最好有点线性代数基础*

既然是两项两项一起出现的，那么就一起来运算吧
先来个Naive but useful trick打头：
$$Set\quad \upsilon_{k}=\begin{pmatrix} \textit{F}_{k + 1}\\\textit{F}_{k}\end{pmatrix}(k\in N) \quad so \quad \upsilon_{0}=\begin{pmatrix} \textit{F}_{1}\\\textit{F}_{0}\end{pmatrix}\\ \\ then \quad \upsilon_{k + 1}=\begin{bmatrix}1 &1 \\1 &0 \end{bmatrix}\upsilon_{k}$$

重点出现了，矩阵，要开始玩矩阵了！这时什么"线性无关"、"空间基向量"、"行列式"、"特征向量与特征矩阵"等这些概念需要载入大脑内存了哈，忘了的赶紧谷哥度娘起来(￣.￣)

再清晰一点
$$Suppose \quad A= \begin{bmatrix}1 &1 \\1 &0 \end{bmatrix} then\;we\;get \\ \\ \Rightarrow \qquad \upsilon_{k + 1}=A\upsilon_{k}$$

这里A有对应的含义么，如果Fibonacci相邻两项$\textit{F}_{k + 1}$和$\textit{F}_{k}$看成空间中的向量，那么$\upsilon_{k+1}$就是$\upsilon_{k}$在A变换下产生的向量，直观的看，这里是不是有点像简单的递推式了？

关键就是这里，看清楚喔，变换矩阵A可是n维实对称阵啊，还记得线代上被虐过的定理吧：**n阶实对称阵必存在n个实特征值和n个线性无关的特征向量，而且能被对角化** 。
(啊，这啥意思啊，赶紧查下AI)  (;￢＿￢)   

回来再说，一般某矩阵如果能分解为特征值与特征向量来表示的话，那么恭喜你，你就能看到这个矩阵的本质了，毕竟起名都叫"特征"了(ﾟ▽ﾟ)/如果你再将某矩阵n个线性无关的特征向量组合起来形成空间的话（姑且称为特征矩阵吧），你就知道：
**矩阵A在物理上就变成了一种投影关系，表示将某个向量投影到A的特征矩阵代表的空间**。
如果理解了这一点，上面的式子就像是从$\upsilon_{0}$开始，不断地被A向量进行着变换，但是不要慌，我们的推导不用这么抽象。

A的特征向量和特征值先求起来吧，忘了的直接用python或matlab工具包愉快的求出来吧。这样你会愉悦地发现：
**特征值刚好就是两个黄金比例二次方程的两个根！**

惊喜不惊喜，意外不意外!

呵呵，其实没啥意外的，大道归一...没关系，继续来

A的两个特征值是：$\lambda_{1}=\frac{1 + \sqrt{5}}{2}\approx1.618\quad\lambda_{2}=\frac{1 - \sqrt{5}}{2}\approx-0.618$
>有点要记住啊，这里我们suppose绝对值大的那个特征值是$\lambda_{1}$，会看到后面有用的。

A的两个特征值$\lambda_{1}$，$\lambda_{2}$分别对应特征向量为$\chi_{1}=\begin{pmatrix}\lambda_{1}\\1\end{pmatrix}$，$\chi_{2}=\begin{pmatrix}\lambda_{2}\\1\end{pmatrix}$

关键的Suppose来了：
**由于A的两个特征向量是线性无关的，我们就把这两货作为新2维空间的基，将$\upsilon_{0}$在这个空间中表示出来**
$$\upsilon_{0}=\begin{pmatrix} \textit{F}_{1}\\\textit{F}_{0}\end{pmatrix}=c_{1}\chi_{1}+c_{2}\chi_{2}=\begin{bmatrix}c_{1}\lambda{1}+c_{2}\lambda{2}\\c_{1}+c_{2}\end{bmatrix}$$
如果再矩阵化的话是这样的
$$Suppose\quad S=\begin{bmatrix}\lambda_{1} &\lambda_{2} \\1 &1 \end{bmatrix} \quad and \quad C=\begin{bmatrix} c_{1}\\c_{2} \end{bmatrix} \\ \\ then \quad\upsilon_{0}=SC$$

这里S可以称为特征矩阵吧

好戏来了!
根据之前Fibonacci的递推式$\upsilon_{k + 1}=A\upsilon_{k}$，我们可知:$\upsilon_{k}=A^{k}\upsilon_{0}$，而根据提过的对角化的优美性质(￣▽￣)~*，我们知道矩阵A是可以分解为(可以验证的):
$$A=S \Lambda S^{-1}\quad here \quad \Lambda = \begin{bmatrix}\lambda_{1} & 0\\0 &\lambda_{2} \end{bmatrix}$$
其中S就是上面的特征矩阵；又计算得知$A^{k}=S\Lambda^{k}S^{-1}$

所以...铺垫这么多，终于可以推导了(这里详细一点)
$$\upsilon_{k}=A^{k}\upsilon_{0}=A^{k}SC=S\Lambda^{k}S^{-1}SC=S\Lambda^{k}C\\=\begin{bmatrix}\lambda_{1} &\lambda_{2} \\1 &1 \end{bmatrix}\begin{bmatrix}\lambda_{1}^{k} & 0\\0 &\lambda_{2}^{k} \end{bmatrix}\begin{bmatrix} c_{1}\\c_{2} \end{bmatrix}=\begin{bmatrix} c_{1}\lambda_{1}^{k+1} + c_{2}\lambda_{2}^{k+1}\\c_{1}\lambda_{1}^{k} + c_{2}\lambda_{2}^{k} \end{bmatrix}=\begin{bmatrix} \textit{F}_{k+1}\\\textit{F}_{k} \end{bmatrix}$$

这...这，我们想要的通项公式出来了啊!
先求出$c_{1}$，$c_{2}$吧
$$\upsilon_{0}=\begin{pmatrix} \textit{F}_{1}\\\textit{F}_{0}\end{pmatrix}=\begin{bmatrix}c_{1}\lambda{1}+c_{2}\lambda{2}\\c_{1}+c_{2}\end{bmatrix}=\begin{pmatrix}1\\1\end{pmatrix}\Rightarrow c_{1}=\frac{1-\lambda_{2}}{\lambda_{1}-\lambda_{2}}, c_{2}=\frac{\lambda_{1}-1}{\lambda_{1}-\lambda_{2}}$$

## 总结

通过线性代数的工具，我们成功地将斐波那契数列与黄金分割联系在了一起。这不仅展示了数学的美妙，也说明了不同数学分支之间的深刻联系。黄金分割作为自然界中的普遍规律，在斐波那契数列中得到了完美的体现。
