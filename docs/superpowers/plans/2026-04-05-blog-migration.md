# Blog Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate 9 blog posts from the old Hugo site into the Astro site, add a `category` field to the blog schema, and wire up `all | tech | life` filter buttons in the blog window.

**Architecture:** Add `category: z.enum(['tech', 'life'])` to the Astro content collection schema, create 9 new `.md` files in `src/content/blog/` with YAML frontmatter (title, date, summary, category) and unchanged body content, patch the 2 existing posts, then extend `Desktop.astro` to render filter buttons and handle click filtering via a dedicated JS block.

**Tech Stack:** Astro content collections, TypeScript schema (Zod), vanilla JS for client-side filtering, existing `.filter-btn` / `.books-filters` CSS classes.

---

## File Map

| Action | File |
|---|---|
| Modify | `src/content/config.ts` |
| Modify | `src/content/blog/2026-03-15-openstack-cloudnative.md` |
| Modify | `src/content/blog/2026-04-01-claude-code-website.md` |
| Create | `src/content/blog/2021-06-05-consistent-hash.md` |
| Create | `src/content/blog/2021-06-13-virtual-nodes-distribution.md` |
| Create | `src/content/blog/2025-01-04-kubernetes-debugging-methods.md` |
| Create | `src/content/blog/2024-08-30-read-excerpts.md` |
| Create | `src/content/blog/2024-10-20-read-notes.md` |
| Create | `src/content/blog/2025-01-01-new-year-reflection.md` |
| Create | `src/content/blog/2025-01-02-work-and-thoughts.md` |
| Create | `src/content/blog/2025-01-17-read-and-thoughts.md` |
| Create | `src/content/blog/2025-06-08-life.md` |
| Modify | `src/components/Desktop.astro` |

---

## Task 1: Update blog schema + patch existing posts

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/content/blog/2026-03-15-openstack-cloudnative.md`
- Modify: `src/content/blog/2026-04-01-claude-code-website.md`

- [ ] **Step 1: Add `category` to blog schema in `src/content/config.ts`**

Replace the `blog` collection definition (the last collection before `export`):

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // "YYYY-MM-DD"
    summary: z.string(),
    category: z.enum(['tech', 'life']),
  }),
});
```

- [ ] **Step 2: Add `category` to `src/content/blog/2026-03-15-openstack-cloudnative.md`**

Update the frontmatter to:

```yaml
---
title: "我的 OpenStack 云原生化实践总结"
date: "2026-03-15"
summary: "5 年华为云 OpenStack 经验，30+ 组件迁移 K8s 的技术细节与踩坑记录。"
category: tech
---
```

(Keep the body content unchanged.)

- [ ] **Step 3: Add `category` to `src/content/blog/2026-04-01-claude-code-website.md`**

Update the frontmatter to:

```yaml
---
title: "如何用 Claude Code 构建个人网站"
date: "2026-04-01"
summary: "用 AI 辅助开发一个模拟 Linux 桌面的 Astro 个人网站全过程记录。"
category: tech
---
```

(Keep the body content unchanged.)

- [ ] **Step 4: Run build to verify schema and existing posts are valid**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript or content collection errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts src/content/blog/2026-03-15-openstack-cloudnative.md src/content/blog/2026-04-01-claude-code-website.md
git commit -m "feat: add category field to blog schema"
```

---

## Task 2: Migrate tech posts

**Files:**
- Create: `src/content/blog/2021-06-05-consistent-hash.md`
- Create: `src/content/blog/2021-06-13-virtual-nodes-distribution.md`
- Create: `src/content/blog/2025-01-04-kubernetes-debugging-methods.md`

- [ ] **Step 1: Create `src/content/blog/2021-06-05-consistent-hash.md`**

```markdown
---
title: "一致性Hash算法与虚拟节点"
date: "2021-06-05"
summary: "通过 Hash 环和虚拟节点机制，深入解析分布式系统中的一致性 Hash 算法如何最小化节点变动时的数据迁移量。"
category: tech
---
## 缘起

今天我们来说说"一致性Hash"算法，以及虚拟节点。

这并不是一个难理解的概念，希望一篇文章下来，你能完全吃透。

在网站系统发展初期，前辈工程师探索出了数据库这一系统核心组件，

数据的持久化被与系统本身解耦开，独立发展且愈加可靠。

时间往后推移，随着互联网的普及，一个系统需要承载的用户数量指数级增长，

开发者不得不横向扩展服务器，通过负载均衡技术，使用户分散到各个服务器上。

随着服务器的增多，可靠的数据库系统也不堪重负，

开发者不得不将数据库中的数据通过"分库分表"技术，切分到不同的数据库中，

减轻单一数据库系统的压力。

那么问题来了，如何知道我们需要的数据在哪个数据库中？

没错。hash！

正如我们在 HashMap 中做的一样，对参数取 hash 值，再对 hash 值取模，

就可以既均匀切分存储数据，又知道数据在哪个库中。

## 简单hash

举个例子，现在有A，B，C，D共4个库，和参数为1，2，3……9，10共10个数据。

![简单Hash](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077122/2021-06-05-%E7%AE%80%E5%8D%95Hash_qmbf9a.webp)

我们简化hash算法为乘以1，

即 (1*1)%4=1，参数为1的数据落在A库中。

即 (2*1)%4=2，参数为2的数据落在B库中。

即 (3*1)%4=3，参数为3的数据落在C库中。

即 (4*1)%4=0，参数为4的数据落在D库中。

……

![简单Hash图2](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077373/2021-06-05-%E7%AE%80%E5%8D%95Hash%E5%9B%BE2_wgcdar.webp)

嗯！我很满意，一切井然有序。

当系统需要参数为2的数据时，只需要通过定位算法 (2*1)%4=2 便知道数据存在B库中。

当系统需要参数为9的数据时，只需要通过定位算法 (9*1)%4=1 便知道数据存在A库中。

可好景不长，正当系统稳定健康运行的时候，

B库不知道出现什么问题，失去了连接，系统中只剩下A，C，D共3个库。

这可真糟糕，但是我们还不知道会发生什么事情，对系统的影响有多大。

让我们先把目光聚集到局部上面来分析一下，

参数为2,6和10的数据存在B库上，影响应该是最大的，

如果现在系统需要参数为2的数据，那么它会通过定位算法  (2*1)%3=2 找到C库上。

![简单Hash图3](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077285/2021-06-05-%E7%AE%80%E5%8D%95Hash%E5%9B%BE3_iemdmd.webp)

但很遗憾，C上并没有存储参数为2的数据。

值得庆幸的是，原来数据是有副本的，失去连接的B库数据并没有丢失，而是在一个更大的主库中，

只要给系统一些时间，主库中对应B库的数据，就会根据定位算法被重新分配到A，C，D库中。

分配如下，

即 (2*1)%3=2，参数为2的数据落在C库中。

即 (6*1)%3=0，参数为6的数据落在D库中。

即 (10*1)%3=1，参数为10的数据落在A库中。

![简单Hash图4](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077435/2021-06-05-%E7%AE%80%E5%8D%95Hash%E5%9B%BE4_lufbom.webp)

好了，现在原来B库中的数据被重新分配到A，C，D库。

当系统需要取数据的时候，只需要通过参数根据定位算法，

到对应的库中读取即可。

如果现在你以为万事大吉，那可就太早了。

别忘了我们刚刚是聚焦到局部来分析状况的。

当我们目光拉远时，我们发现，

不止是参数为2,6,10的数据被重新分配，

几乎所有的数据都被重新分配了！

因为，

 (1*1)%3=1，参数为1的数据落在A库中。

 (2*1)%3=2，参数为2的数据落在C库中。

 (3*1)%3=0，参数为3的数据落在D库中。

……

![简单Hash图5](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077525/2021-06-05-%E7%AE%80%E5%8D%95Hash%E5%9B%BE5_g7cgue.webp)

真是糟糕透顶！

原本是想节约提高性能，结果凭空需要浪费这么多计算资源在重新分配数据上。

该怎么办呢？

诶，对，一致性Hash算法要大显身手了！

## 一致性Hash算法

一致性Hash算法通过一个 Hash 环，巧妙的让影响降到很低。

假设存在一个 Hash 环，它一圈的范围是 0 到 2^32-1，

先对数据库A，B，C和D的标识做 hash 运算，即上面的定位算法，

确定4个库在 Hash 环上的位置，

再通过定位算法将得出参数为1，2，3……9，10共10个数据在 Hash环上的位置，

这边我们不展示过程，只展示结果。

![一致性Hash](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077577/2021-06-05-%E4%B8%80%E8%87%B4%E6%80%A7Hash_mmbfui.webp)

一致性Hash算法规定我们将数据存在定位到的 Hash 环上位置顺时针遇到的第一个节点（数据库）。

即，

参数为1,4和8的数据存在数据库A中，

参数为5的数据存在数据库B中，

参数为3和7的数据存在数据库C中，

参数为2,6,9和10的数据存在数据库D中。

此时，其实我们已经不惧怕数据库宕机的情况了，

假设我们的数据库B又一次失去连接。

会发生什么情况呢？

![一执行Hash图2](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077641/2021-06-05-%E4%B8%80%E8%87%B4%E6%80%A7Hash%E5%9B%BE2_bckrcm.webp)

影响十分有限，只有数据库A和B在 Hash 环上的位置之间的数据，才受到了影响。

如图，参数为5的数据，需要重新从主库中复制到数据库C中，以保证系统需要参数为5的数据时可以顺利读取到。

而对于其他参数值的数据，并没有受到影响。

以上描述的是节点减少的情况，实际上在节点增加的时候，

一致性Hash算法依然可以保持大部分节点的稳定，不需要改变。

在这里我不做赘述，但你参考上面，独立思考一下。

一致性 Hash 算法如果只是到这里，实际上还引入了一个新的问题——数据倾斜。

即我们假设数据落在 Hash 环上每个位置的概率是一致的，

但实际上，每个节点覆盖的 Hash 环上的大小并不相等，

甚至可能有几倍的差距。

例如，在上面A，C，D库的基础上，我们添加了一个节点——数据库E。

它的位置如图所示。

![一执行Hash图3](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077713/2021-06-05-%E4%B8%80%E8%87%B4%E6%80%A7Hash%E5%9B%BE3_cm8ar0.webp)

因为它（数据库E）与上一个节点（数据库D）距离太近，导致没有任何一个数据落到它上面，

而正是与他相近特别近的上一个节点（数据库D），却存储了4个数据，

这就是数据倾斜，有些节点承载了很重的任务，有些节点却悠闲悠闲。

## 虚拟节点

为了解决数据倾斜的问题，我们还需要加入虚拟节点这一策略。

即，将每个数据库都通过定位算法生成几个在 Hash 环上的位置，

每个位置都承担上面节点的功能，

区别在于原来每个数据库对应一个节点，

现在每个数据库会对应若干个节点，

这就是虚拟节点。

![虚拟节点](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736077771/2021-06-05-%E8%99%9A%E6%8B%9F%E8%8A%82%E7%82%B9_pmdari.webp)

为了避免图过于混乱，这边我标出 E 数据库的 3 个虚拟节点，

可以从图中看出，现在

E#1有 0 个数据，

E#2有 1 个数据（参数为5的数据），

E#3有 2 个数据（参数为6和9的数据）。

而实际上，不管数据定位后归属与E#1、E#2还是E#3，

在实际的数据存储和读取时，都是在数据库 E。

不难发现，在添加了虚拟节点的策略之后，

数据倾斜的情况得到了改善。

这就是完整的一致性Hash算法与虚拟节点啦！

记住，在实际应用中，3个虚拟节点是不够的，你需要更多的虚拟节点，以保证节点的负载更加均衡。
```

- [ ] **Step 2: Create `src/content/blog/2021-06-13-virtual-nodes-distribution.md`**

```markdown
---
title: "我在Dubbo源码里学到了如何保证虚拟节点均匀分布"
date: "2021-06-13"
summary: "从 Dubbo 源码出发，剖析一致性 Hash 算法如何利用 MD5 + 位运算保证虚拟节点在 Hash 环上的均匀分布。"
category: tech
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
```

- [ ] **Step 3: Create `src/content/blog/2025-01-04-kubernetes-debugging-methods.md`**

```markdown
---
title: "Kubernetes生态下的软件调试方法——以Provider为例"
date: "2025-01-04"
summary: "利用 AWS EKS + Terraform 搭建按需创建的 Kubernetes 测试环境，完整记录调试 Terraform Provider 的全流程。"
category: tech
---
## 背景

在公司的时候，有很多调试环境部署有K8S集群供开发自验证，

但在家参与一些开源项目的时候，因为无法使用公司环境，导致缺少可以自验证的环境。

以前一般使用MiniKube或Docker部署K8S集群等方式构建测试环境，

但缺点是对机器的要求比较高，我的17年8G运行内存的Mac只能是堪堪运行起集群，

再要在上面做一些调试，开个IDE，开个浏览器等，十分费劲。

## 趋势

升级机器配置，我也有过这个想法，但不免几年就需要升级一次，费钱费时间，且机器95%以上的时间都是闲置的，并不划算。

所以利用付费的云化资源+轻量的终端进行开发工作，越来越成为我近年来的一种趋势。

## 更进一步

单纯的云化资源并不能很好的控制成本，借鉴企业的的做法，弹性伸缩才是降低成本的要点。

使用Terraform在测试时自动化创建出基础设施，是我们应该提倡的。

## 以Provider为例

### 登录AWS控制台

登录AWS的EKS服务，本文以美国（俄亥俄州）为例

![EKS服务](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735983171/2025-01-04-EKS服务_cy4fgp.png)

### 安装Terraform

```shell
sudo yum install -y yum-utils shadow-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform
```

### 部署EKS集群

#### 初始化工作空间

```shell
git clone https://github.com/hashicorp-education/learn-terraform-provision-eks-cluster
cd learn-terraform-provision-eks-cluster
terraform init
```

#### 部署集群

```shell
terraform apply -auto-approve
```

#### 验证集群功能

```shell
aws eks --region $(terraform output -raw region) update-kubeconfig --name $(terraform output -raw cluster_name)
kubectl cluster-info
kubectl get nodes
```

![验证集群功能](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735992522/2025-01-04-验证集群功能_cr1jhi.png)

### 调试Provider

#### 安装Go

```shell
brew install go@1.22
```

#### 克隆Provider项目

```shell
git clone https://github.com/<YOUR-USERNAME>/terraform-provider-kubernetes.git
cd terraform-provider-kubernetes
```

#### 编译Provider

```shell
bash scripts/build.sh
```

### 去部署EKS集群

验证完毕，别忘了销毁集群，因为它时刻都在计费！

```shell
cd ~/learn-terraform-provision-eks-cluster
terraform destroy -auto-approve
```

## 总结

到此，本文介绍的方法就讲完了，欢迎各位一试～
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds, 3 new tech posts appear in build output.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog/2021-06-05-consistent-hash.md src/content/blog/2021-06-13-virtual-nodes-distribution.md src/content/blog/2025-01-04-kubernetes-debugging-methods.md
git commit -m "feat: migrate tech blog posts from old site"
```

---

## Task 3: Migrate life posts (batch 1)

**Files:**
- Create: `src/content/blog/2024-08-30-read-excerpts.md`
- Create: `src/content/blog/2024-10-20-read-notes.md`
- Create: `src/content/blog/2025-01-01-new-year-reflection.md`

- [ ] **Step 1: Create `src/content/blog/2024-08-30-read-excerpts.md`**

```markdown
---
title: "阅读节选"
date: "2024-08-30"
summary: "摘录《多谈谈问题》《原子习惯》中关于目标构建、自由意志与身份驱动型习惯改变的精华段落。"
category: life
---
## 阅读节选

我是觉得人一定要有自己的基本盘，这非常重要。比如我现在问很多人，以后还有什么目标、理想吗？他们都说没有。我是一直有的，甚至知道自己以后十年、二十年、三十年、四十年的目标。始终有一个目标，也许你到不了，但是一直在路上，你在这个过程中是有满足感的，所以我觉得，能在新的价值体系里找到一个新的目标去追求，非常重要。这个目标必须相对具象，而且真的和你对自己的情感认同、价值认同有关联。

—— 节选自《多谈谈问题》

**我认为一个人文主义者应该坚定地同机械主义、决定论、宿命论做最持久的斗争，因为这不仅关乎自由意志，更关乎人类的道德。**

—— 节选自《多谈谈问题》

许多人开始改变自己的习惯时，把注意力集中在自己想要达到的目标上。这会导致他们养成基于最终结果的习惯。正确的做法是培养基于自己身份的习惯。真正的行为上的改变是身份的改变。

—— 节选自《原子习惯》(中文版)
```

- [ ] **Step 2: Create `src/content/blog/2024-10-20-read-notes.md`**

```markdown
---
title: "阅读笔记<一>"
date: "2024-10-20"
summary: "对中国收入分布数据、智能手机加密漏洞、博弈论与华为鸿蒙争议的多篇阅读笔记与批注。"
category: life
---
## 中国人的收入到底有多高

根据北师大 CHIPs 数据：中国有 39.1% 的人口月收入低于1000元。但「家庭人均可支配」的统计方式让我们高估了贫困程度——一对夫妻外出务工养三个家庭成员，工厂工资3000元出头，人均就是1000元左右。

月税后挣到5000元以上（包括奖金），就超过了全国 80% 的工薪族。税后工资过万，超过 97.5%。

## How law enforcement gets around your smartphone's encryption

政府执法机构破解手机比多数人想象中的更容易。开机第一次解锁之后，全盘加密的密钥就会位于内存中。此时只要能利用某种系统漏洞拿到内存中的密钥，就可以解密手机数据。相比之下，关机状态下破解难度大得多。

## 博弈论【换位思考】

需要站在"对手"的角度进行思考，才能看清局面，从而更好地选择自己的策略。

## 华为鸿蒙争议

**华为高管的辩解，属于"偷换概念"（稻草人谬误）。** 把"鸿蒙使用AOSP代码"偷换为"鸿蒙使用谷歌代码"，再针对后一个命题进行反驳——这是典型的稻草人谬误。
```

- [ ] **Step 3: Create `src/content/blog/2025-01-01-new-year-reflection.md`**

```markdown
---
title: "新年伊始的记录与思考"
date: "2025-01-01"
summary: "元旦日记：从一次取车出行到图书馆八小时的开源调试，记录时间记录与自我审视的意义。"
category: life
---
## 早上

元旦，出门去取前几日送到4S店维修漆面的车。

刚出小区，看着路旁的小河，开始感叹年复一年时光流逝。

跳出来想，也许看似浪费**时间的时常记录和反思**才是捷径，

因为这种记录能给予后来阅读的自己力量，令"其"道心不变，坚定地走下去。

## 中午

中午，在浙江图书馆门口遇到传统的爆米花，第一次见，来了兴趣拍了几张。

![浙图门口爆米花](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735748510/2025-01-01-浙图门口爆米花_j3rlth.jpg)

## 接下来的八小时

接下来的八个多小时，沉浸在这个我初次探访的图书馆的自修室，

内容是由一开始的"为`hashicorp/terraform-provider-kubernetes`开源项目修复一个上周工作中遇到的Bug"

到"给`hashicorp/terraform-provider-kubernetes`开源项目提该Bug的Issue并与社区成员确认修复方案是否可行"

再到"使用AWS的EKS搭建terraform-provider-kubernetes测试环境"。

我的开发工作就是这样，总是一直入栈，然后再一步步出栈，才能完成。

## 反思

今天反思后想到的几个点：

1. 需要延长每日的工作时间，不为别的，而是需要在本职工作外有时间投入其它，避免陷入"996"怪圈
2. 本职工作占据的时间太长，且很多时候压力太大，经常让我陷于其中而忘了职业生涯这盘大棋，这需要每日警醒
3. 记录本身很耗费时间，尤其在刚开始做这个事情的时候，但时间一长不经能让我阶段性复盘调整，也是我以后向上最扎实的土壤

![浙图旁景区小道](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735748789/2025-01-01-浙图旁景区小道_p6xn9v.jpg)
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds, 3 new life posts appear in build output.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog/2024-08-30-read-excerpts.md src/content/blog/2024-10-20-read-notes.md src/content/blog/2025-01-01-new-year-reflection.md
git commit -m "feat: migrate life blog posts batch 1"
```

---

## Task 4: Migrate life posts (batch 2)

**Files:**
- Create: `src/content/blog/2025-01-02-work-and-thoughts.md`
- Create: `src/content/blog/2025-01-17-read-and-thoughts.md`
- Create: `src/content/blog/2025-06-08-life.md`

- [ ] **Step 1: Create `src/content/blog/2025-01-02-work-and-thoughts.md`**

```markdown
---
title: "续记、续想"
date: "2025-01-02"
summary: "深度反思 996 工作制对个人成长的侵蚀，援引编程随想的分析，思考如何在高压工作中保持自我成长空间。"
category: life
---
书接上回，继续写下自己的思考。

## 工作记录

今天一天都在带着几个项目组里的同事与其他部门同事对齐问题，修复并验证问题。

等反应过来，就已经晚上8点30分，到下班时间了。

## 996怪圈

编程随想在博文中提到：

> 大多数人都知道——加班意味着业余时间减少。业余时间减少也就意味着：你更加没有时间去自学，去提升自己的能力。如果你的能力得不到提升，你在人力市场上的议价能力也就得不到提升。然后你就不得不继续接受这种变态的工作时间。俺把这称之为【996怪圈】——它是一个恶性循环，你陷入其中，并越来越无法自拔。

我十分赞同。

也提到：

> 超长的工作时间，使得你必须长时间面对自己不感兴趣的工作内容。当你忙碌了一天，终于回家的时候，很可能**你的自控力已消耗殆尽**。

我不能更赞同了，其实我可以完全接受超长时间的工作，前提是我觉得这个很有意义，我感兴趣。

这也是我的理想状态——热情工作时全身心投入，阶段性休息时完全放松。

借今天的思考，把结论写在个人网站首页，尽早推演出跳出【996怪圈】的术，然后证道，走向理想工作～
```

- [ ] **Step 2: Create `src/content/blog/2025-01-17-read-and-thoughts.md`**

```markdown
---
title: "读《活着》有感"
date: "2025-01-17"
summary: "读余华《活着》后，以福贵的苦难为镜，重新审视自己所谓的压力与困境，获得面对挫败的勇气与豁然。"
category: life
---
高中时我是很喜欢文学的，那也是我目前为止的文学巅峰，每个课间操我都会从下楼的队伍中偷溜出到一楼的图书馆里去看书，所以有幸进行了大量阅读。饶是如此，有位作者的书我却始终没有翻开过，那便是余华。

最近又养成习惯读书，顺着微信读书总榜Top200读下来，第四本就是余华老师的《活着》。有些感想，便写下这篇读后感记录一番。

令我有所感触的是突然意识到早在我未出生时，便有很多传世之作已然落成。**我所要做的就是在书海里找到它，这与花费自己有限的一生去探索来说，实在是过于简单。**

书往前翻，是福贵这充满苦难的一生——究极的苦难，死亡。与这般苦难相比，我所经历的事情，所面临的困难，其实即使是以最差的结果去估计，也不过是丢脸、被批评，甚至连挨打挨饿都绝无可能。所以我的担惊受怕完全是多余的，**努力去做好就行，结果不好也没关系。**
```

- [ ] **Step 3: Create `src/content/blog/2025-06-08-life.md`**

```markdown
---
title: "时间规划"
date: "2025-06-08"
summary: "以周为单位规划主业、开源贡献与文学阅读的时间分配，并列出从开源贡献者到独立项目创始人的三阶段路线图。"
category: life
---
## 整体的时间规划

![时间规划](https://res.cloudinary.com/dbsadrsxp/image/upload/v1749381136/2025-06-08-%E6%97%B6%E9%97%B4%E5%8D%A0%E6%AF%94_zp0mt7.png)

以周为单位，分割自己的时间安排

- 主业工作
- 个人开源项目探索
- 参与开源项目维护
- 文学阅读

## 个人开源项目探索

### 行动路线图

- Day 1-3：选择一个方向，用 100 行代码实现 MVP。
- Day 4-5：在 Reddit/Python 论坛发起讨论，收集反馈。
- Day 6-7：根据反馈迭代代码，发布 0.1.0 版到 PyPI。
- 持续运营：每两周发布一个版本，同步撰写技术博客解析设计思路。

### 向独立项目过渡的路线图

阶段 1：成为知名项目的核心贡献者（6-12 个月）
目标：在 2-3 个高活跃度项目中进入贡献者排行榜 Top 10。

阶段 2：孵化实验性项目（1-2 个月）
目标：开发一个小型工具解决你在贡献过程中发现的痛点。

阶段 3：推广与生态整合（持续迭代）
目标：让项目成为父生态的推荐工具。
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds. All 11 blog posts (2 existing + 9 migrated) appear in build output.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog/2025-01-02-work-and-thoughts.md src/content/blog/2025-01-17-read-and-thoughts.md src/content/blog/2025-06-08-life.md
git commit -m "feat: migrate life blog posts batch 2"
```

---

## Task 5: Add category filter to blog window in Desktop.astro

**Files:**
- Modify: `src/components/Desktop.astro`

Three changes are needed: (1) add filter buttons HTML, (2) add `data-category` to each `.blog-row`, (3) add blog filter JS + update `resetBlogWindow()`.

- [ ] **Step 1: Add filter buttons and `data-category` to the blog window**

Find this block in `src/components/Desktop.astro`:

```astro
    <!-- Blog Window -->
    <Window id="blog" title="blog/" defaultWidth={520} defaultHeight={380} defaultTop={120} defaultLeft={200}>
      <div class="blog-list" id="blog-list">
        {blogPosts.map(post => (
          <button
            class="blog-row"
            data-post-id={post.id}
            aria-label={post.data.title}
          >
```

Replace with:

```astro
    <!-- Blog Window -->
    <Window id="blog" title="blog/" defaultWidth={520} defaultHeight={380} defaultTop={120} defaultLeft={200}>
      <div class="books-filters" id="blog-filters">
        <button class="filter-btn active" data-filter="all">all</button>
        <button class="filter-btn" data-filter="tech">tech</button>
        <button class="filter-btn" data-filter="life">life</button>
      </div>
      <div class="blog-list" id="blog-list">
        {blogPosts.map(post => (
          <button
            class="blog-row"
            data-post-id={post.id}
            data-category={post.data.category}
            aria-label={post.data.title}
          >
```

- [ ] **Step 2: Add blog filter JS — insert BEFORE the `// Media filter` comment in the `<script>` block**

```js
    // Blog category filter
    document.querySelectorAll('#blog-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = document.getElementById('blog-filters');
        group?.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.blog-row').forEach(row => {
          row.style.display = (filter === 'all' || row.dataset.category === filter) ? '' : 'none';
        });
      });
    });

```

- [ ] **Step 3: Update `resetBlogWindow()` to reset filter state on window reopen**

Find:

```js
    function resetBlogWindow() {
      const list = document.getElementById('blog-list');
      const detail = document.getElementById('blog-detail');
      const content = document.getElementById('blog-post-content');
      const winTitle = document.querySelector('#win-blog .win-title');
      if (list) list.style.display = '';
      if (detail) detail.style.display = 'none';
      if (content) content.innerHTML = '';
      if (winTitle) winTitle.textContent = 'blog/';
    }
```

Replace with:

```js
    function resetBlogWindow() {
      const list = document.getElementById('blog-list');
      const detail = document.getElementById('blog-detail');
      const content = document.getElementById('blog-post-content');
      const winTitle = document.querySelector('#win-blog .win-title');
      if (list) list.style.display = '';
      if (detail) detail.style.display = 'none';
      if (content) content.innerHTML = '';
      if (winTitle) winTitle.textContent = 'blog/';
      // Reset filter to "all"
      document.querySelectorAll('#blog-filters .filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('#blog-filters .filter-btn[data-filter="all"]')?.classList.add('active');
      document.querySelectorAll('.blog-row').forEach(row => row.style.display = '');
    }
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, open `http://localhost:4321/blog`:

- Blog window shows filter buttons: `all | tech | life`
- `tech` → shows 5 tech posts only; `life` → shows 6 life posts only; `all` → shows all 11
- Click a post → detail view; `← back` → returns to filtered list
- Close and reopen the blog window → filter resets to `all`

- [ ] **Step 6: Commit**

```bash
git add src/components/Desktop.astro
git commit -m "feat: add tech/life category filter to blog window"
```
