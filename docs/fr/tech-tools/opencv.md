# OpenCV

OpenCV est une bibliothèque de vision par ordinateur utilisée pour lire, transformer, analyser et détecter des éléments dans des images ou vidéos.

## Cas d’usage

- traitement d’images ;
- détection de contours ;
- reconnaissance d’objets ;
- analyse vidéo ;
- prétraitement pour des modèles IA ;
- prototypage de fonctionnalités caméra.

## Installation Python

```bash
pip install opencv-python
```

## Exemple simple

```python
import cv2

image = cv2.imread('input.jpg')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imwrite('gray.jpg', gray)
```

## Concepts utiles

- image matricielle ;
- espaces de couleur ;
- filtrage et flou ;
- seuillage ;
- contours ;
- transformations géométriques.

## Références

- Version chinoise : `/zh/tech-tools/opencv`

