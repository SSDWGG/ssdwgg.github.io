# OpenCV 介绍与使用

OpenCV 是一个开源计算机视觉库，常用于图像处理、视频分析、目标检测、图像识别、OCR 前处理、工业检测和视觉算法原型验证。它最早以 C/C++ 为核心实现，同时提供 Python、Java、JavaScript 等语言绑定。

如果把 AI 视觉任务拆开看，OpenCV 更偏向“图像工程与视觉基础能力”：它负责读图、变换、滤波、提取特征、处理轮廓、操作视频帧，而深度学习模型更多负责语义识别、分类和检测。

## 适合做什么

- 图片读取、裁剪、缩放、旋转、颜色空间转换。
- 图像增强，例如去噪、锐化、直方图均衡化。
- 边缘检测、轮廓提取、形态学处理。
- 摄像头视频帧采集与实时处理。
- 人脸、二维码、车牌、缺陷检测等视觉任务的前处理。
- 与深度学习模型配合，完成推理前后处理。

## 安装

Python 项目中最常见的安装方式：

```bash
pip install opencv-python
```

如果需要额外算法模块，可以安装：

```bash
pip install opencv-contrib-python
```

服务器或容器环境如果不需要图形窗口，可以使用无 GUI 版本：

```bash
pip install opencv-python-headless
```

## 基础使用

### 读取与保存图片

```python
import cv2

image = cv2.imread("input.jpg")

if image is None:
    raise FileNotFoundError("图片读取失败")

cv2.imwrite("output.jpg", image)
```

OpenCV 默认使用 `BGR` 通道顺序，而不是前端和很多图像库常见的 `RGB`。这点非常重要。

### 显示图片

```python
import cv2

image = cv2.imread("input.jpg")

cv2.imshow("preview", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

如果在服务器、Docker 或无桌面环境中运行，`imshow` 可能不可用，建议改为保存图片或使用 Notebook 展示。

### 颜色空间转换

```python
import cv2

image = cv2.imread("input.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

cv2.imwrite("gray.jpg", gray)
```

常见颜色空间：

| 颜色空间 | 说明 |
| :--- | :--- |
| BGR | OpenCV 默认格式 |
| RGB | Web、PIL、Matplotlib 常见格式 |
| Gray | 灰度图，适合边缘、轮廓、阈值处理 |
| HSV | 适合按颜色范围做识别和分割 |

## 常见图像处理

### 缩放与裁剪

```python
import cv2

image = cv2.imread("input.jpg")

resized = cv2.resize(image, (640, 360))
cropped = image[100:300, 200:500]

cv2.imwrite("resized.jpg", resized)
cv2.imwrite("cropped.jpg", cropped)
```

OpenCV 图片本质上是 `numpy.ndarray`，裁剪语法是：

```python
image[y1:y2, x1:x2]
```

注意先写 `y`，再写 `x`。

### 高斯模糊

```python
import cv2

image = cv2.imread("input.jpg")
blurred = cv2.GaussianBlur(image, (5, 5), 0)

cv2.imwrite("blurred.jpg", blurred)
```

高斯模糊常用于降噪，让边缘检测、阈值分割等后续处理更稳定。

### 阈值分割

```python
import cv2

image = cv2.imread("input.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

cv2.imwrite("binary.jpg", binary)
```

阈值分割会把灰度图转成黑白图，适合处理文字、轮廓、简单前景背景分离。

### 边缘检测

```python
import cv2

image = cv2.imread("input.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blurred, 50, 150)

cv2.imwrite("edges.jpg", edges)
```

`Canny` 是常用边缘检测算法，核心流程大致包括降噪、计算梯度、非极大值抑制和双阈值连接。

### 轮廓提取

```python
import cv2

image = cv2.imread("input.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
_, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

for contour in contours:
    x, y, w, h = cv2.boundingRect(contour)
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

cv2.imwrite("contours.jpg", image)
```

轮廓常用于定位目标外接矩形、面积筛选、形状判断和简单缺陷检测。

## 视频与摄像头处理

```python
import cv2

cap = cv2.VideoCapture(0)

while True:
    ok, frame = cap.read()
    if not ok:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cv2.imshow("camera", gray)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
```

视频处理的本质是对每一帧图片执行相同或相似的处理逻辑。实时性取决于帧率、分辨率、算法复杂度和硬件性能。

## 原理层理解

### 1. 图片本质是矩阵

在 OpenCV 中，一张图片可以理解为一个多维数组：

- 灰度图：`height × width`
- 彩色图：`height × width × channels`

每个像素的值通常是 `0 ~ 255`，表示亮度或颜色强度。图像处理算法本质上就是对这些矩阵做数学运算。

### 2. 卷积是很多算法的基础

模糊、锐化、边缘检测都可以理解为卷积操作：用一个小矩阵窗口在图像上滑动，对周围像素加权求和。

例如：

- 均值滤波：让周围像素平均，达到平滑效果。
- 高斯滤波：距离中心越近权重越大，平滑更自然。
- Sobel 算子：计算水平或垂直方向的梯度，用来检测边缘。

### 3. 阈值分割是分类的最简形式

阈值分割把像素按数值分成两类：

- 大于阈值：前景
- 小于阈值：背景

这是一种非常朴素但实用的图像分割方式。光照稳定、背景简单时效果很好；光照复杂时通常需要自适应阈值或更复杂的模型。

### 4. 形态学操作处理的是形状

形态学常用于二值图：

- 腐蚀：让白色区域变小，去掉小噪点。
- 膨胀：让白色区域变大，连接断裂区域。
- 开运算：先腐蚀后膨胀，适合去噪。
- 闭运算：先膨胀后腐蚀，适合填补空洞。

### 5. 传统视觉与深度学习可以互补

传统 OpenCV 算法适合规则清晰、场景可控的问题；深度学习适合语义复杂、变化多的问题。

常见组合方式：

1. OpenCV 读取图片或视频帧。
2. OpenCV 做 resize、归一化、颜色转换。
3. 深度学习模型完成检测、分类、分割。
4. OpenCV 绘制框、裁剪结果、保存视频。

## 常见坑

- 忘记 `BGR` 与 `RGB` 的差异，导致颜色显示异常。
- 读图路径错误，`imread` 返回 `None` 却继续处理。
- 在服务器环境使用 `imshow`，导致窗口相关错误。
- 裁剪时把 `x`、`y` 顺序写反。
- 阈值、核大小、边缘检测参数照抄，不结合图片实际调整。
- 对大图逐像素 Python 循环处理，性能很差，应优先使用 OpenCV 或 NumPy 向量化能力。

## 学习路线

1. 先掌握读写图片、颜色转换、裁剪缩放。
2. 再学习滤波、阈值、边缘、轮廓。
3. 接着练习摄像头和视频逐帧处理。
4. 最后把 OpenCV 与深度学习模型推理流程结合起来。

## 一句话总结

OpenCV 的核心不是“识别一切”，而是把图像变成可计算、可处理、可分析的数据，并为更复杂的视觉任务提供基础能力。
