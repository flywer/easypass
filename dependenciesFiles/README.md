在我们在打包的时候会发现，报错下载失败，因为它的打包文件有几个是在git下载的，由于网络原因，下载不下来，导致出错。

将这些文件解压放在`%LOCALAPPDATA%/electron/Cache`目录下即可，若存在可直接覆盖
