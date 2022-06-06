'use strict';
//Definimos las variables para el modelo
const X_MODEL = 200;
const Y_MODEL = 230;

let modelo;

//definimos las constantes para obtener y procesar el video

const VIDEO_WIDTH = 320;
const VIDEO_HEIGHT = 500;
const videoFrame = document.getElementById('video_frame');
const canvasResized = document.getElementById('canvas_resized');
var ctx = canvasResized.getContext('2d');

//definimos el tamano del video
const constraints = {
    audio: false,
    video: {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT
    },
    facingMode: {
        exact: 'environment'
      }
}

//comprobamos acceso a webcam

async function initWebCam() {
    try{
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        cargarCamara(stream);
    }catch(e){

        alert(`navigator.getUserMedia error:${e.toString()}`);
    }
}

//si el acceso es correcto se carga la web cam

async function cargarCamara(stream){
    videoFrame.srcObject = stream;
    procesarVideo();
    predecir();
}

const cargarModelo = async () => modelo = await tf.loadLayersModel('./modelo.json');  

function procesarVideo(){
    
    ctx.drawImage(videoFrame, 0, 0, X_MODEL, Y_MODEL);
    let frame = ctx.getImageData(0,0,X_MODEL,Y_MODEL);
    

    for (let i = 0; i < frame.data.length /4; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        let grey = parseInt((r+g+b)/3);

        frame.data[i*4 + 0] = grey;
        frame.data[i*4 + 1] = grey;
        frame.data[i*4 + 2] = grey;
    }
    ctx.putImageData(frame, 0, 0);
    setTimeout(procesarVideo, 20);
}

function normalizar(){
    var imgData = ctx.getImageData(0, 0, X_MODEL, Y_MODEL);
    var arr = []; //para los pixeles de la imagen
    var x_pixels = []; //al llegar al final de ancho se pasa como nuevo elemento del arr
    for (var i=0; i < imgData.data.length; i+=4){
        var normalizado = imgData.data[i]/255;
        x_pixels.push([normalizado]);
        if(x_pixels.length == X_MODEL){
            arr.push(x_pixels);
            x_pixels=[];
        }
    }
    arr = [arr];
    return arr
}

function predecir(){
    if(modelo != null){
        var arr_modelo = normalizar();

        var tensor4 = tf.tensor4d(arr_modelo);
        console.log(tensor4)
        var resultados = modelo.predict(tensor4).dataSync();
        
        var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados))
        var clases = ['ectomorfo','endomorfo', 'mesomorfo'];
        console.log('Prediccion: ', clases[mayorIndice]);
        document.getElementById('resultado-ia').innerHTML = clases[mayorIndice];

    }
    setTimeout(predecir, 150);

}

initWebCam();
cargarModelo();