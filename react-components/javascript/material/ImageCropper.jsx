import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { Box, Modal, Typography } from '@mui/material';

const ImageCropper = forwardRef(
  ({ onCrop, circularCrop, aspect, children, initalAspect = 1 }, ref) => {
    const imageInput = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [imgSrc, setImgSrc] = useState('');
    const [completedCrop, setCompletedCrop] = useState();
    const [open, setOpen] = useState(false);

    const [crop, setCrop] = useState();

    useImperativeHandle(ref, () => ({
      selectImage() {
        imageInput.current.click();
      },
    }));

    const handleInputChange = e => {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        setCrop(undefined);
        reader.onload = function () {
          const imageSrc = reader.result.toString() || '';
          const image = new Image();
          setOpen(true);
          setImgSrc(imageSrc);
          image.onload = function () {
            setCrop(
              centerCrop(
                makeAspectCrop(
                  {
                    unit: '%',
                    width: 90,
                  },
                  initalAspect,
                  image.width,
                  image.height,
                ),
                image.width,
                image.height,
              ),
            );
          };
          image.src = imageSrc;
        };
        reader.readAsDataURL(file);
      }
    };

    const cropImage = () => {
      const cropImage = imageRef.current;
      if (cropImage && completedCrop) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const scaleX = cropImage.naturalWidth / cropImage.width;
        const scaleY = cropImage.naturalHeight / cropImage.height;
        //   const pixelRatio = window.devicePixelRatio;
        const width = Math.floor(completedCrop.width * scaleX);
        const height = Math.floor(completedCrop.height * scaleY);
        const x = Math.floor(completedCrop.x * scaleX);
        const y = Math.floor(completedCrop.y * scaleY);
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingQuality = 'high';
        ctx.save();
        if (circularCrop) {
          const radius = width / 2;
          ctx.beginPath();
          ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
          ctx.clip();
        }
        ctx.drawImage(cropImage, x, y, width, height, 0, 0, width, height);
        const base64Image = canvas.toDataURL('image/png');

        ctx.restore();

        if (typeof onCrop === 'function') {
          onCrop(base64Image);
        }
      }
    };

    const handleDoneClick = () => {
      cropImage();
      setOpen(false);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <input
          ref={imageInput}
          type="file"
          hidden
          onChange={handleInputChange}
          onClick={event => {
            event.target.value = null;
          }}
          accept="image/png, image/jpeg"
        />
        <Modal open={open}>
          <Box sx={styles.wrapper}>
            <Box display="flex" justifyContent="space-between" sx={{ mx: 2, mb: 1 }}>
              <Box onClick={handleClose}>
                <Typography sx={styles.txtCancel}>Cancel</Typography>
              </Box>
              <Box onClick={handleDoneClick}>
                <Typography sx={styles.txtDone}>Done</Typography>
              </Box>
            </Box>
            <Box sx={styles.cropper}>
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={c => setCompletedCrop(c)}
                  circularCrop={circularCrop}
                  maxHeight={500}
                  keepSelection={true}
                  aspect={aspect}
                >
                  <img ref={imageRef} src={imgSrc} />
                </ReactCrop>
              )}
            </Box>
            {children}
          </Box>
        </Modal>
        <canvas ref={canvasRef} hidden />
      </>
    );
  },
);

export default ImageCropper;

const styles = {
  wrapper: {
    bgcolor: 'white',
    mx: 'auto',
    width: 'max-content',
    marginTop: '100px',
    paddingLeft: '2px',
    paddingRight: '2px',
    py: 1,
    borderRadius: 1,
    userSelect: 'none',
    '*': {
      userSelect: 'none',
    },
  },
  cropper: {
    width: { xs: 350, lg: 400 },
    height: { xs: 350, lg: 400 },
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  txtCancel: {
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
  },
  txtDone: {
    fontWeight: 'bold',
    color: 'blue',
    cursor: 'pointer',
    userSelect: 'none',
  },
};
