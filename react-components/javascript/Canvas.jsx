import React, { memo, useEffect, forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { fabric } from 'fabric';
import { expand } from '../assets/images/icons';
import { updateCanvasData as updateCanvasStoreData } from '../store/redux/actions/canvas';
import { useDispatch, useSelector } from 'react-redux';
import DesignImageCrop from './DesignImageCrop';
import MpEvent from '../utils/mpEvent';

export const Mode = {
  FRONT: 'front',
  BACK: 'back',
};

// to see controller outside canvas box
const OUTLINE_WIDTH = 400;
const DESIGN_SIZE = 1800;
const SCREEN_SIZE = 3600;
const MEDIUM_SIZE = 600;
const THUMBNAIL_SIZE = 50;

const Canvas = forwardRef(({ canvasMode, ...props }, ref) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);

  const { frontJsonData, backJsonData, backgroundColor } = useSelector(state => state.canvas);

  const [canvas, setCanvas] = useState();
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [backgroundRect, setBackgroundRect] = useState(null);

  useImperativeHandle(ref, () => ({
    centerSelectedObject(axis) {
      const selected = canvas.getActiveObject();
      if (selected) {
        if (axis === 'y') {
          selected.viewportCenterH();
          canvas.renderAll();
        } else {
          selected.viewportCenterY();
          canvas.renderAll();
        }
        updateCanvasData();
      }
    },
    deleteItem() {
      const selected = canvas.getActiveObject();
      if (selected !== undefined) {
        canvas.remove(selected);
      }
    },
    addImage() {
      cropperRef.current.open();
    },
  }));

  useEffect(() => {
    if (backgroundColor && canvas) {
      if (backgroundRect) {
        canvas.remove(backgroundRect);
      }
      const width = canvas.width / zoom - OUTLINE_WIDTH * 2;
      const height = canvas.height / zoom - OUTLINE_WIDTH * 2;

      var rect = new fabric.Rect({
        top: OUTLINE_WIDTH,
        left: OUTLINE_WIDTH,
        width,
        height,
        rx: width * 0.11,
        ry: height * 0.06,
        objectCaching: false,
        fill: backgroundColor,
        selectable: false,
      });
      rect.toObject = (function (toObject) {
        return function (propertiesToInclude) {
          return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
            id: 'backgroundRect',
          });
        };
      })(rect.toObject);
      canvas.add(rect);
      rect.sendToBack();
      setBackgroundRect(rect);
      canvas.renderAll();
    }
  }, [backgroundColor]);

  const initCanvas = () => {
    const canvasContainer = canvasRef.current?.parentNode;

    const scale = canvasContainer.clientWidth / DESIGN_SIZE;
    const zoom = DESIGN_SIZE / SCREEN_SIZE;
    setScale(scale);
    setZoom(zoom);

    const outlineWidth = OUTLINE_WIDTH * scale * zoom;
    canvasRef.current.style.margin = `-${outlineWidth}px`;
    canvasRef.current.style.transform = `scale(${scale})`;
    const canvasWidth = DESIGN_SIZE + OUTLINE_WIDTH * zoom * 2;
    const canvasHeight = canvasContainer.clientHeight / scale + OUTLINE_WIDTH * zoom * 2;
    const options = {
      width: canvasWidth,
      height: canvasHeight,
    };
    return new fabric.Canvas('newCanvas', options);
  };

  const applyProperties = selectedObject => {
    var expandIcon = document.createElement('img');
    expandIcon.src = expand;
    selectedObject.padding = 5 / scale;
    selectedObject.borderColor = '#116dffaf';
    selectedObject.borderScaleFactor = 1 / scale;
    selectedObject.transparentCorners = false;
    selectedObject.cornerColor = 'white';
    selectedObject.cornerStyle = 'circle';
    selectedObject.cornerSize = 30 / scale;
    selectedObject.controls.expandControl = new fabric.Control({
      ...selectedObject.controls.br,
      x: 0.5,
      y: 0.5,
      render: renderIcon,
      cornerSize: 30 / scale,
      img: expandIcon,
    });

    selectedObject.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: false,
    });
    canvas.renderAll();
  };

  var getCroppedImage = function (size) {
    return new Promise(resolve => {
      const buffer = document.createElement('canvas');
      const b_ctx = buffer.getContext('2d');

      const screenWidth = canvas.width - OUTLINE_WIDTH * zoom * 2;
      const screenHeight = canvas.height - OUTLINE_WIDTH * zoom * 2;

      buffer.width = size;
      buffer.height = (size / screenWidth) * screenHeight;

      const offsetX = OUTLINE_WIDTH * zoom;
      const offsetY = OUTLINE_WIDTH * zoom;
      const width = Math.round(canvas.width - OUTLINE_WIDTH * zoom * 2);
      const height = Math.round(canvas.height - OUTLINE_WIDTH * zoom * 2);

      const img = new Image();

      img.onload = () => {
        b_ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, buffer.width, buffer.height);
        resolve(buffer.toDataURL());
      };
      img.src = canvas.toDataURL();
    });
  };

  const updateCanvasData = async () => {
    if (!canvasRef.current) return;
    const isFront = canvas.mode === Mode.FRONT;
    const json = canvas.toJSON();

    const [original, medium, thumbnail] = await Promise.all([
      getCroppedImage(DESIGN_SIZE),
      getCroppedImage(MEDIUM_SIZE),
      getCroppedImage(THUMBNAIL_SIZE),
    ]);

    const designImages = {
      original,
      medium,
      thumbnail,
    };

    if (isFront) {
      dispatch(
        updateCanvasStoreData({
          frontDesignImages: designImages,
          frontJsonData: json,
        }),
      );
    } else {
      dispatch(
        updateCanvasStoreData({
          backDesignImages: designImages,
          backJsonData: json,
        }),
      );
    }
  };

  function renderIcon(ctx, left, top) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  useEffect(() => {
    const jsonData = canvasMode === Mode.FRONT ? frontJsonData : backJsonData;

    if (canvas) {
      canvas.setZoom(zoom);
      canvas.clear();
      if (jsonData) {
        canvas.loadFromJSON(
          jsonData,
          function () {
            canvas.renderAll.bind(canvas);
            canvas.renderAll();
            canvas.mode = canvasMode;
            updateCanvasData();
          },
          function (json, object) {
            if (json.id === 'backgroundRect') {
              object.selectable = false;
              object.toObject = (function (toObject) {
                return function (propertiesToInclude) {
                  return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                    id: 'backgroundRect',
                  });
                };
              })(object.toObject);
              setBackgroundRect(object);
            }
          },
        );
      } else {
        canvas.mode = canvasMode;
      }
    }
  }, [canvasMode, canvas]);

  const addImageToCanvas = data => {
    fabric.Image.fromURL(data, async outputImage => {
      outputImage.set({
        hasRotatingPoint: false,
      });
      outputImage.scaleToWidth((DESIGN_SIZE / zoom) * 0.8);
      canvas.add(outputImage);
      canvas.setActiveObject(outputImage);
      canvas.viewportCenterObject(outputImage);
      canvas.renderAll();
      updateCanvasData();
    });
  };

  const limitObjectBounderies = object => {
    if (object.left < OUTLINE_WIDTH) {
      object.left = OUTLINE_WIDTH;
    }
    if (object.left + object.width * object.scaleX > SCREEN_SIZE + OUTLINE_WIDTH) {
      object.left = SCREEN_SIZE + OUTLINE_WIDTH - object.width * object.scaleX;
    }
    if (object.top < OUTLINE_WIDTH) {
      object.top = OUTLINE_WIDTH;
    }
    if (object.top + object.height * object.scaleY > canvas.height / zoom - OUTLINE_WIDTH) {
      object.top = canvas.height / zoom - OUTLINE_WIDTH - object.height * object.scaleY;
    }
  };

  React.useEffect(() => {
    if (canvas) {
      // http://fabricjs.com/events
      let isMouseUp = true;
      canvas.on({
        'selection:created': e => {
          const obj = e.selected[0];
          MpEvent.dispatch('MpSelectionUpdated', true);
          applyProperties(obj);
        },
        'selection:updated': e => {
          const obj = e.selected[0];
          applyProperties(obj);
        },
        'object:scaling': e => {
          const obj = e.target;
          obj.lockScalingFlip = true;
          if (obj.left > SCREEN_SIZE + OUTLINE_WIDTH - obj.width * obj.scaleX) {
            obj.scaleX = (SCREEN_SIZE + OUTLINE_WIDTH - obj.left) / obj.width;
            obj.scaleY = (obj.scaleX * obj.width) / obj.height;
          }
          if (obj.top > canvas.height / zoom - OUTLINE_WIDTH - obj.height * obj.scaleY) {
            obj.scaleY = (canvas.height / zoom - OUTLINE_WIDTH - obj.top) / obj.height;
            obj.scaleX = (obj.scaleY * obj.height) / obj.width;
          }
        },
        'mouse:down': () => {
          isMouseUp = false;
        },
        'mouse:up': e => {
          isMouseUp = true;
          const obj = e.target;
          if (obj) {
            const objectCenter = obj.left + (obj.width * obj.scaleX) / 2;
            const canvasMiddle = canvas.width / zoom / 2;
            if (
              objectCenter > canvasMiddle - 7 / scale / zoom &&
              objectCenter < canvasMiddle + 7 / scale / zoom
            ) {
              obj.viewportCenterH();
              canvas.renderAll();
            }
          }
          setTimeout(() => {
            MpEvent.dispatch('MpShowCenterLine', false);
          }, 400);
          updateCanvasData();
        },
        'object:moving': e => {
          const obj = e.target;
          const objectCenter = obj.left + (obj.width * obj.scaleX) / 2;
          const canvasMiddle = canvas.width / zoom / 2;

          if (isMouseUp) {
            MpEvent.dispatch('MpShowCenterLine', false);
          } else {
            if (
              objectCenter > canvasMiddle - 5 / scale / zoom &&
              objectCenter < canvasMiddle + 5 / scale / zoom
            ) {
              MpEvent.dispatch('MpShowCenterLine', true);
            } else {
              MpEvent.dispatch('MpShowCenterLine', false);
            }
          }

          limitObjectBounderies(obj);
        },
        'selection:cleared': () => {
          MpEvent.dispatch('MpSelectionUpdated', false);
          updateCanvasData();
        },
      });
    }
  }, [canvas]);

  useEffect(() => {
    const canvas = initCanvas();
    setCanvas(canvas);
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
  }, []);

  return (
    <>
      <canvas id="newCanvas" ref={canvasRef} {...props} />
      <DesignImageCrop ref={cropperRef} onCrop={addImageToCanvas} />
    </>
  );
});

export default memo(Canvas);
