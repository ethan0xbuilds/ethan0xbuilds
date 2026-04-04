---
title: "Kubernetes生态下的软件调试方法——以Provider为例"
date: "2025-01-04"
summary: "利用 AWS EKS + Terraform 搭建按需创建的 Kubernetes 测试环境，完整记录调试 Terraform Provider 的全流程。"
category: "tech"
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

本文也是基于这一种思想构建的一种调试方法，供君参考。

## 更进一步

单纯的云化资源并不能很好的控制成本，借鉴企业的的做法，弹性伸缩才是降低成本的要点。

所以我们在使用云化资源的时候也要贯彻这一种做法，

尤其在需要使用K8S集群这类资源开销更大的业务时，

使用Terraform在测试时自动化创建出基础设施，是我们应该提倡的。

## 以Provider为例

上周在工作中遇到一个Kubernetes Provider的社区Bug，因为公司的业务版本发布在即，所以优先采用打补丁的方式完成修复。

但计划在业余时间帮助社区修复该Bug，修复时发现缺少自验证的环境，于是开始探索下面使用AWS的EKS构建测试环境的方法。

### 登录AWS控制台

登录AWS的EKS服务，本文以美国（俄亥俄州）为例

![EKS服务](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735983171/2025-01-04-EKS服务_cy4fgp.png)

### 安装Terraform

参考Terraform的Install教程，在AWS临时终端中安装Terraform

```shell
sudo yum install -y yum-utils shadow-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform
```

![安装Terraform](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735983311/2025-01-04-安装Terraform_em4i3f.png)

### 部署EKS集群

参考Terraform的部署EKS集群教程，通过AWS终端部署EKS集群

#### 初始化工作空间

```shell
git clone https://github.com/hashicorp-education/learn-terraform-provision-eks-cluster
cd learn-terraform-provision-eks-cluster
terraform init
```

![初始化工作空间](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735983578/2025-01-04-初始化工作空间_hizkxy.png)

#### 部署集群

```shell
terraform apply -auto-approve
```

预计花费10分钟完成集群部署，部署后可以在ESK集群管理页面看到该集群

![部署完成](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736009409/2025-01-04-部署完成_dxddod.png)

#### 验证集群功能

配置kubectl

```shell
aws eks --region $(terraform output -raw region) update-kubeconfig --name $(terraform output -raw cluster_name)
```

查看集群信息

```shell
kubectl cluster-info
```

查看node信息

```shell
kubectl get nodes
```

![验证集群功能](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735992522/2025-01-04-验证集群功能_cr1jhi.png)

#### 部署Deployment资源

参考Terraform的管理K8S资源，通过Terraform部署测试服务到集群

创建工作目录，编辑kubernetes.tf文件

```shell
cd ~
mkdir learn-terraform-deploy-nginx-kubernetes
cd learn-terraform-deploy-nginx-kubernetes
vim kubernetes.tf
```

初始化工作目录

```shell
terraform init
```

修改kubernetes.tf，增加Deployment资源后Apply

```shell
vim kubernetes.tf
terraform apply -auto-approve
```

查看Deployment资源

```shell
kubectl get deployments
```

![查看Deployment资源](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736005342/2025-01-04-查看Deployment资源_kyl29m.png)

#### 去部署Deployment资源

```shell
cd ~/learn-terraform-deploy-nginx-kubernetes
terraform destroy -auto-approve
```

![去部署Deployment资源](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736005590/2025-01-04-去部署Deployment资源_v0rvjx.png)

### 调试Provider

参考Kubernetes Provider项目的贡献指南

#### 安装Go

```shell
brew install go@1.22
```

![安装Go](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735985374/2025-01-04-安装Go_avfvmb.png)

#### 克隆Provider项目

Fork Provider项目到自己的仓库下，再克隆到本地

```shell
git clone https://github.com/<YOUR-USERNAME>/terraform-provider-kubernetes.git
cd terraform-provider-kubernetes
```

![克隆Provider项目](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735985599/2025-01-04-克隆Provider项目_qkkqhd.png)

#### 修改代码

即修改terraform-provider-kubernetes代码

#### 编译Provider

```shell
bash scripts/build.sh
```

![编译Provider](https://res.cloudinary.com/dbsadrsxp/image/upload/v1735989908/2025-01-04-编译Provider_ndtjop.png)

#### 替换二进制文件

将编译好的Provider上传到AWS终端，替换原二进制文件

![替换二进制文件](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736006202/2025-01-04-替换二进制文件_gvdhgl.png)

#### 验证Provider修改

执行可以验证到修改的操作，例如再次部署Deployment资源

### 去部署EKS集群

验证完毕，别忘了销毁集群，因为它时刻都在计费！

```shell
cd ~/learn-terraform-provision-eks-cluster
terraform destroy -auto-approve
```

![去部署完成](https://res.cloudinary.com/dbsadrsxp/image/upload/v1736009409/2025-01-05-去部署完成_pfmvpl.png)

## 总结

到此，本文介绍的方法就讲完了，欢迎各位一试～
