import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import { Grid, Button, Box } from '@mui/material';
import Resizer from 'react-image-file-resizer';
import styles from '../components/imageCrop/imageCrop.module.css';

export default function ImageCrop(props) {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState(
    props.variant === 'storeLogo'
      ? { unit: '%', width: 100, aspect: 1 / 1, x: 0, y: 0 }
      : {
          unit: '%',
          width: 100,
          aspect: 16 / 9,
          x: 0,
          y: 0,
        },
  );
  const [completedCrop, setCompletedCrop] = useState(null);
  const [toggleControls, setToggleControls] = useState(false);
  const [toggleUploadButton, setToggleUploadButton] = useState(true);
  const resizeFile = file =>
    new Promise(resolve => {
      Resizer.imageFileResizer(
        file,
        1200,
        800,
        'PNG',
        100,
        0,
        uri => {
          resolve(uri);
        },
        'file',
      );
    });
  const onSelectFile = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const resizedImage = await resizeFile(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(resizedImage);
    }
    setToggleControls(true);
    setToggleUploadButton(false);
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );
  }, [completedCrop]);

  const cropImage = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          blob.name = 'image.jpg';
          resolve(blob);
          if (
            (props.variant === 'storeLogo' || props.variant === 'coverPic') &&
            props.type === 'createForm'
          ) {
            var reader = new FileReader();
            reader.onload = e => props.setImage(e.target.result);
            reader.readAsDataURL(blob);
          }
          if (props.variant === 'storeLogo') {
            console.log('is logo');
            props.setImage('logo', blob);
          } else {
            console.log('avatar');
            props.setImage('coverAvatar', blob);
          }
        },
        'image/jpeg',
        1,
      );
      props.handleClose();
    });
  };

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Grid>
      {toggleUploadButton ? (
        <Grid
          item
          md={12}
          style={{
            height: '20vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button variant="contained" component="label">
            Upload File
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={onSelectFile}
              hidden
            />
          </Button>
        </Grid>
      ) : (
        ''
      )}

      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          {toggleControls && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '3rem',
              }}
            >
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => cropImage(previewCanvasRef.current, completedCrop)}>
                Done
              </Button>
            </Box>
          )}
        </Grid>
        <Grid item md={12} style={{ paddingTop: '0px' }}>
          <ReactCrop
            className={styles.disableDrag}
            src={upImg}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            circularCrop={props.variant === 'storeLogo' ? true : false}
            locked={props.variant === 'storeLogo' ? false : true}
          >
            <img src={upImg} />
          </ReactCrop>
        </Grid>

        <div hidden>
          <canvas
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}
