// http://fabricjs.com/controls-customization
// http://fabricjs.com/events
// http://fabricjs.com/clippath-part3

import React, {
  memo,
  useEffect,
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from "react";
import { fabric } from "fabric";
import { expand } from "../assets/images/icons";
import { updateCanvasData as updateCanvasStoreData } from "../store/redux/actions/canvas";
import { useDispatch, useSelector } from "react-redux";
import DesignImageCrop from "./DesignImageCrop";
import MpEvent from "../utils/mpEvent";

export const Mode = {
  FRONT: "front",
  BACK: "back",
};

/**
 *  Design size - canvas size in pixel where the design will be drawing. it determins the quality of the design
 *  Screen size - relative canvas size which is recognized by fabric.js
 *  Outline width - extra size extension to the canvas to show object outline and controller handlers which will take place out the design area in case the object at border.
 */

// real canvas size
const DESIGN_SIZE = 500; // in design pixel
const ALLOWD_EXTRA = 80; // in pixel

// abstracted canvas size
const OUTLINE_WIDTH = 200; // in fabric unit
// fabric.js scene width
const SCREEN_SIZE = 3600; // in fabric unit

// Image sizes
const ORIGINAL_SIZE = 1200;
const MEDIUM_SIZE = 600;
const THUMBNAIL_SIZE = 60;

/**
 * Unit Calculation
 *
 * rp - Real Pixel
 * dp - Design Pixel
 * fp - Fabric Picel
 *
 * scale = rp / dp
 * zoom = dp / fp
 *
 * rp = dp * scale
 * rp = fp * zoom * scale
 *
 * dp = rp / scale
 * dp = fp * zoom
 *
 * fp = dp / zoom
 * fp = rp / scale / zoom
 */

let canvas = null;
const Canvas = forwardRef(({ canvasMode, ...props }, ref) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);

  const { frontJsonData, backJsonData, backgroundColor } = useSelector(
    (state) => state.canvas
  );
  const [backgroundRect, setBackgroundRect] = useState(null);

  const [printWidth, setPrintWidth] = useState(DESIGN_SIZE);
  const [printHeight, setPrintHeight] = useState(DESIGN_SIZE);

  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);

  const [designRatio, setDesignRatio] = useState(1);

  const [scale, setScale] = useState(1);

  const allowedExtra = ALLOWD_EXTRA;

  useImperativeHandle(ref, () => ({
    centerSelectedObject(axis) {
      const selected = canvas.getActiveObject();
      if (selected) {
        if (axis === "y") {
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
      canvas.setBackgroundColor(backgroundColor)
      // if (backgroundRect) {
      //   backgroundRect.setOptions({
      //     fill: backgroundColor,
      //   });
      // } else {
      //   const zoom = canvas.getZoom();

      //   const top = OUTLINE_WIDTH;
      //   const left = OUTLINE_WIDTH;

      //   const width = canvas.width / zoom - top * 2;
      //   const height = canvas.height / zoom - left * 2;

      //   var rect = new fabric.Rect({
      //     top,
      //     left,
      //     width,
      //     height,
      //     rx: width * 0.11,
      //     ry: height * 0.06,
      //     objectCaching: false,
      //     fill: backgroundColor,
      //     selectable: false,
      //   });
      //   rect.toObject = (function (toObject) {
      //     return function (propertiesToInclude) {
      //       return fabric.util.object.extend(
      //         toObject.call(this, propertiesToInclude),
      //         {
      //           id: "backgroundRect",
      //         }
      //       );
      //     };
      //   })(rect.toObject);
      //   canvas.add(rect);
      //   rect.sendToBack();
      //   setBackgroundRect(rect);
      }
      updateCanvasData();
      canvas.renderAll();
    }
  }, [backgroundColor]);

  const initCanvas = () => {
    if (canvas) {
      canvas.dispose();
    }

    let canvasContainer = canvasRef.current?.parentNode;

    while (canvasContainer) {
      if (canvasContainer.classList.contains("frontCanvas")) {
        break;
      }
      canvasContainer = canvasContainer.parentNode;
    }

    if (!canvasContainer) {
      throw "Canvas container class does not exist";
    }

    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;

    // transform scale to make the design fit to container
    const scale = (containerWidth + allowedExtra * 2) / DESIGN_SIZE;
    setScale(scale);
    // fabric zoom to zoom in/out fabric object to make it be inside design size area.
    const zoom = DESIGN_SIZE / SCREEN_SIZE;

    // design ratio
    const dr = containerWidth / containerHeight;
    setDesignRatio(dr);
    // delta width
    const dx = OUTLINE_WIDTH + allowedExtra / zoom / scale;
    setDeltaX(dx);
    // delta height
    const dy = OUTLINE_WIDTH + allowedExtra / dr / zoom / scale;
    setDeltaY(dy);

    const marginX = dx * scale * zoom;
    const marginY = dy * scale * zoom;

    canvasRef.current.style.margin = `-${marginY}px -${marginX}px`;
    canvasRef.current.style.transform = `scale(${scale})`;

    const canvasWidth = DESIGN_SIZE + OUTLINE_WIDTH * zoom * 2;
    const canvasHeight = DESIGN_SIZE / dr + OUTLINE_WIDTH * zoom * 2;

    const wholeScreenWidth = SCREEN_SIZE + OUTLINE_WIDTH * 2;
    const wholeScreenHeight = SCREEN_SIZE / dr + OUTLINE_WIDTH * 2;
    const designScreenWidth = wholeScreenWidth - dx * 2;
    const designScreenHeight = wholeScreenHeight - dy * 2;
    setPrintWidth(designScreenWidth);
    setPrintHeight(designScreenHeight);

    const options = {
      width: canvasWidth,
      height: canvasHeight,
    };

    canvas = new fabric.Canvas("newCanvas", options);

    let isMouseUp = true;
    canvas.on({
      "selection:created": (e) => {
        const obj = e.selected[0];
        MpEvent.dispatch("MpSelectionUpdated", true);
        applyProperties(obj, scale);
      },
      "selection:updated": (e) => {
        const obj = e.selected[0];
        applyProperties(obj, scale);
      },
      "object:scaling": (e) => {
        const obj = e.target;
        obj.lockScalingFlip = true;
        if (obj.left > SCREEN_SIZE + OUTLINE_WIDTH - obj.width * obj.scaleX) {
          obj.scaleX = (SCREEN_SIZE + OUTLINE_WIDTH - obj.left) / obj.width;
          obj.scaleY = obj.scaleX;
        }

        const bottomLimit = wholeScreenHeight - OUTLINE_WIDTH - dy + dx;
        if (obj.top > bottomLimit - obj.height * obj.scaleY) {
          obj.scaleY = (bottomLimit - obj.top) / obj.height;
          obj.scaleX = obj.scaleY;
        }
      },
      "mouse:down": () => {
        isMouseUp = false;
      },
      "mouse:up": (e) => {
        isMouseUp = true;
        const obj = e.target;
        if (obj) {
          const objectCenter = obj.left + (obj.width * obj.scaleX) / 2;
          const canvasMiddle = canvas.width / zoom / 2;
          if (
            objectCenter > canvasMiddle - 12 / scale / zoom &&
            objectCenter < canvasMiddle + 12 / scale / zoom
          ) {
            MpEvent.dispatch("MpShowCenterLine", true);
            obj.viewportCenterH();
            canvas.renderAll();
          }
        }
        setTimeout(() => {
          MpEvent.dispatch("MpShowCenterLine", false);
        }, 400);
        updateCanvasData();
      },
      "object:moving": (e) => {
        const object = e.target;
        // const objectCenter = obj.left + (obj.width * obj.scaleX) / 2;
        // const canvasMiddle = canvas.width / zoom / 2;

        // if (isMouseUp) {
        //   MpEvent.dispatch('MpShowCenterLine', false);
        // }
        // else {
        //   if (
        //     objectCenter > canvasMiddle - 5 / scale / zoom &&
        //     objectCenter < canvasMiddle + 5 / scale / zoom
        //   ) {
        //     MpEvent.dispatch('MpShowCenterLine', true);
        //   } else {
        //     MpEvent.dispatch('MpShowCenterLine', false);
        //   }
        // }

        if (object.left < OUTLINE_WIDTH) {
          object.left = OUTLINE_WIDTH;
        }
        if (
          object.left + object.width * object.scaleX >
          SCREEN_SIZE + OUTLINE_WIDTH
        ) {
          object.left =
            SCREEN_SIZE + OUTLINE_WIDTH - object.width * object.scaleX;
        }

        const topLimit = OUTLINE_WIDTH + dy - dx;

        if (object.top < topLimit) {
          object.top = topLimit;
        }
        if (
          object.top + object.height * object.scaleY >
          canvas.height / zoom - topLimit
        ) {
          object.top =
            canvas.height / zoom - topLimit - object.height * object.scaleY;
        }
      },
      "selection:cleared": () => {
        MpEvent.dispatch("MpSelectionUpdated", false);
        updateCanvasData();
      },
      "path:created": (options) => {
        console.log("path created", options);
      },
    });

    canvas.setZoom(zoom);
    canvas.controlsAboveOverlay = true;
    const clipPath = new fabric.Rect({
      top: dy,
      left: dx,
      width: designScreenWidth,
      height: designScreenHeight,
      rx: designScreenWidth * 0.11,
      ry: designScreenHeight * 0.06,
      objectCaching: false,
      fill: "#ff000034",
      selectable: false,
    });
    canvas.clipPath = clipPath;
  };

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  const applyProperties = (selectedObject, scale) => {
    var expandIcon = document.createElement("img");
    expandIcon.src = expand;
    selectedObject.padding = 3 / scale;
    selectedObject.borderColor = "#116dffaf";
    selectedObject.borderScaleFactor = 1 / scale;
    selectedObject.transparentCorners = false;
    selectedObject.cornerColor = "#116dff";
    selectedObject.cornerSize = 50 / scale;
    selectedObject.touchCornerSize = 70 / scale;

    selectedObject.controls.expandControl = new fabric.Control({
      ...selectedObject.controls.br,
      x: 0.5,
      y: 0.5,
      render: renderIcon,
      cornerSize: 18 / scale,
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

  const getCroppedImage = function (size) {
    return new Promise((resolve) => {
      const buffer = document.createElement("canvas");
      const b_ctx = buffer.getContext("2d");
      const zoom = canvas.getZoom();

      buffer.width = size;
      buffer.height = size / designRatio;

      // dp = fp * zoom + rp / scale
      const offsetX = deltaX * zoom;
      const offsetY = deltaY * zoom;

      const width = printWidth * zoom;
      const height = printHeight * zoom;

      const img = new Image();

      img.onload = () => {
        b_ctx.drawImage(
          img,
          offsetX,
          offsetY,
          width,
          height,
          0,
          0,
          buffer.width,
          buffer.height
        );
        resolve(buffer.toDataURL());
      };
      img.src = canvas.toDataURL();
    });
  };

  const updateCanvasData = async () => {
    if (!canvasRef.current) return;
    const isFront = canvas.mode === Mode.FRONT;
    const json = canvas.toJSON();

    json.screen = {
      outlineWidth: OUTLINE_WIDTH,
      designSize: DESIGN_SIZE,
      screenSize: SCREEN_SIZE,
      allowedExtra: allowedExtra,
    };

    const [original, medium, thumbnail] = await Promise.all([
      getCroppedImage(ORIGINAL_SIZE),
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
        })
      );
    } else {
      dispatch(
        updateCanvasStoreData({
          backDesignImages: designImages,
          backJsonData: json,
        })
      );
    }
  };

  useEffect(() => {
    const jsonData = canvasMode === Mode.FRONT ? frontJsonData : backJsonData;
    initCanvas();
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
          if (json.id === "backgroundRect") {
            object.selectable = false;
            object.toObject = (function (toObject) {
              return function (propertiesToInclude) {
                return fabric.util.object.extend(
                  toObject.call(this, propertiesToInclude),
                  {
                    id: "backgroundRect",
                  }
                );
              };
            })(object.toObject);
            setBackgroundRect(object);
          }
        }
      );
    } else {
      canvas.mode = canvasMode;
    }
  }, [canvasMode]);

  const addImageToCanvas = (data) => {
    fabric.Image.fromURL(data, async (outputImage) => {
      outputImage.set({
        hasRotatingPoint: false,
      });
      outputImage.scaleToWidth(printWidth * 0.8);
      canvas.add(outputImage);
      canvas.setActiveObject(outputImage);

      outputImage.clipTo = function (ctx) {
        ctx.save();

        ctx.setTransform(1, 0.5, 0.5, 1, 0.5, 0.5); // Reset transformation to default for canvas
        ctx.rect(
          100,
          100, // Just x, y position starting from top left corner of canvas
          200,
          200 // Width and height of clipping rect
        );

        ctx.restore();
      };

      canvas.viewportCenterObject(outputImage);
      canvas.renderAll();
      updateCanvasData();
    });
  };

  return (
    <>
      <canvas id="newCanvas" ref={canvasRef} {...props} />
      <DesignImageCrop ref={cropperRef} onCrop={addImageToCanvas} />
    </>
  );
});

export default memo(Canvas);
