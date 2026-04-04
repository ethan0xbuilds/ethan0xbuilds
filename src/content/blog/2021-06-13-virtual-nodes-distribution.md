---
title: "我在Dubbo源码里学到了如何保证虚拟节点均匀分布"
date: "2021-06-13"
summary: "从 Dubbo 源码出发，剖析一致性 Hash 算法如何利用 MD5 + 位运算保证虚拟节点在 Hash 环上的均匀分布。"
category: "tech"
---
## 背景

上周更新了一篇文章《一致性Hash算法与虚拟节点》，阅读和收藏人数挺多的。

今天有朋友问了我一个问题，虚拟节点如何保证均匀分布？

![虚拟节点保证均匀分布](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736087686/2021-06-13-%E8%99%9A%E6%8B%9F%E8%8A%82%E7%82%B9%E4%BF%9D%E8%AF%81%E5%9D%87%E5%8C%80%E5%88%86%E5%B8%83_dwiox7.png)

我不假思索的回答，

不需要保证虚拟节点的均匀分布，

虚拟节点用以保证相对的均匀靠得是量变产生质变，

就像我文末提到的，在实际场景中，虚拟节点的个数只有3个是远远不够的。

例如Dubbo中用到一致性hash算法时，默认的虚拟节点个数是160个，

假设我们有四个服务节点需要创建虚拟节点，那就会有 4 * 160 = 640 个虚拟节点，

在这样大量的基数下，必然他们的分布就会呈一种相对均匀的状态。

![虚拟节点保证均匀分布图2](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736087931/2021-06-13-%E8%99%9A%E6%8B%9F%E8%8A%82%E7%82%B9%E4%BF%9D%E8%AF%81%E5%9D%87%E5%8C%80%E5%88%86%E5%B8%83%E5%9B%BE2_wr327p.webp)

回答完我感觉很满意，不愧是我！

可转念一想，再想，三想，

好像不是这么一回事，

别说是有640个节点了，就算有6400个，64000个节点又如何呢？

在极小极小的概率下，如果hash算法不能保证映射的均匀性，

他们依然可能落在十分聚集的一小块区域中。

反推一下，既然一致性hash算法作为一个成熟并拥有很多应用场景的算法，

不可能如此不严谨，所以hash算法本身应该是可以保证映射的一致性的。

东查西查，终于有了答案。

一个合格的散列函数包含三个特征：

- 单向性：容易计算输入的散列结果，但是从散列结果无法倒推出输入；
- 抗冲突性：很难找到两个不同的输入散列结果相同；
- 映射分布均匀性和差分分布均匀性：散列结果中 bit 位上的 0 和 1 的数量应当大致相等；改变输入内容的 1 个 bit 信息会导致散列结果一半以上的 bit 位变化（雪崩效应）。

Dubbo 仓库 ConsistentHashLoadBalance 类的关键代码：

```java
for (int i = 0; i < replicaNumber / 4; i++) {
  byte[] digest = Bytes.getMD5(address + i);
  for (int h = 0; h < 4; h++) {
    long m = hash(digest, h);
    virtualInvokers.put(m, invoker);
  }
}
```

```java
private long hash(byte[] digest, int number) {
  return (((long) (digest[3 + number * 4] & 0xFF) << 24)
          | ((long) (digest[2 + number * 4] & 0xFF) << 16)
          | ((long) (digest[1 + number * 4] & 0xFF) << 8)
          | (digest[number * 4] & 0xFF))
    & 0xFFFFFFFFL;
}
```

## 总结

在Dubbo的源码中，实现一致性hash算法时，用于计算副本位置的定位算法实际上每个位置只需要 MD5 值的四分之一。而合格的散列函数保证了映射分布的均匀性（雪崩效应），即虚拟节点的均匀分布。
