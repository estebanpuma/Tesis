

function calcularPorcentajeGrasa(altura, cuello, cintura){
    var grasa = 86.01*Math.log10((cintura/2.54)-((cuello/2.54)))-70.041*Math.log10(altura/2.54)+36.76;
    return grasa
};

function calcularMasaMagra(peso, grasacorporal){
    return peso*(1-(grasacorporal/100))
};

function calcularBMR(masamagra){
    return (masamagra*21.6)+370
};

function calcularCaloriasMantenimiento(bmr, factorActividad){
    return bmr*factorActividad
};

function calcularCaloriasMeta(meta, caloriasMantenimiento, tipocuerpo){
    var metaSubir; //kilos por mes
    var metaBajar; //kilos por semana

    switch (tipocuerpo){

        case "ec":
            metaBajar = 0.5; 
            metaSubir = 1.3;
            break;
        
        case "me":
            metaBajar = 0.8;
            metaSubir = 1.0;
            break;

        case "en":
            metaBajar = 1.2;
            metaSubir = 0.5;
            break;
    }

    
    if(meta == 'subir'){
        return caloriasMantenimiento + (metaSubir*440);
    }
    else if (meta == 'bajar'){
        return caloriasMantenimiento - (metaBajar*1100)
    }

};


function calcularMacronutrientes(meta, caloriasMeta, tipocuerpo, masamagra){
    var proteinasporkilo;
    var carbohidratosporkilo;
    var grasasporkilo;
    var macros = [];

    switch (tipocuerpo){

        case "ec":
            if(meta = "bajar"){
                proteinasporkilo = 3.0;
                grasasporkilo = 1.2;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
                
            } else{
                proteinasporkilo = 2.2;
                grasasporkilo = ((0.3*caloriasMeta)/9)/masamagra;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
            }
            break;
        
        case "me":
            if(meta = "bajar"){
                proteinasporkilo = 2.5;
                grasasporkilo = 1.1;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
                
            } else{
                proteinasporkilo = 2.0;
                grasasporkilo = ((0.25*caloriasMeta)/9)/masamagra;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
            }
            break;

        case "en":
            if(meta = "bajar"){
                proteinasporkilo = 2.3;
                grasasporkilo = 0.9;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
                
            } else{
                proteinasporkilo = 2.2;
                grasasporkilo = ((0.20*caloriasMeta)/9)/masamagra;
                carbohidratosporkilo = ((caloriasMeta - (proteinasporkilo*4*masamagra + grasasporkilo*9*masamagra))/4)/masamagra;
            }
            break;

    }

    var proteinas = proteinasporkilo * masamagra;
    var carbohidratos = carbohidratosporkilo * masamagra;
    var grasa = grasasporkilo * masamagra;

    macros.push(proteinas, carbohidratos, grasa);

    return macros
};


function onClickCalcularDieta(){
    //Traer variables de HTML
    var cuello = document.getElementById("input_cuello").value;
    var altura = document.getElementById("input_altura").value;
    var cintura = document.getElementById("input_cintura").value;
    var peso = document.getElementById("input_peso").value;
    var factorActividad = document.getElementById("input_nivel_actividad").value;
    var meta = document.querySelector('input[name=meta]:checked').value;
    var tipodecuerpo = document.querySelector('input[name=tipo]:checked').value;
    

    //Calcular valores a mostrar
    var porcentajeGrasa =  calcularPorcentajeGrasa(altura, cuello, cintura); 
    var masamagra = calcularMasaMagra(peso, porcentajeGrasa);
    var bmr = calcularBMR(masamagra);  
    var caloriasMantenimiento = calcularCaloriasMantenimiento(bmr,factorActividad);
    var caloriasMeta = calcularCaloriasMeta(meta, caloriasMantenimiento, tipodecuerpo);
    var macronutrientes = calcularMacronutrientes(meta, caloriasMeta, tipodecuerpo, masamagra); //calculo proteinas, carbohidratos y grasas
    var x = document.getElementById("section-resultados");
    x.style.display = "block";
    console.log(macronutrientes)
    pasarResultados(porcentajeGrasa, masamagra, caloriasMantenimiento, caloriasMeta, macronutrientes, bmr );
    
};

function pasarResultados(porcentajeGrasa, masamagra, caloriasMantenimiento, caloriasMeta, macronutrientes, bmr ){

     //Mostrar valores en HTML
     var out_porcentajeGrasa = document.getElementById("out_porcentajeGrasa");
     out_porcentajeGrasa.innerText = "Tu porcentaje de grasa es: " + porcentajeGrasa.toFixed(0) + "%";
 
     var out_masamagra = document.getElementById("out_masamagra");
     out_masamagra.innerText = "Tu masa magra es de: " + masamagra.toFixed(1) + " Kg";

     var out_bmr = document.getElementById('out_bmr');
     out_bmr.innerText = "BMR: " + bmr.toFixed(1);
 
     var out_caloriasMantemimiento = document.getElementById("out_caloriasMantemimiento");
     out_caloriasMantemimiento.innerText = "Tus calorias de mantenimiento son: " + caloriasMantenimiento.toFixed(0) + " cal";
 
     var out_caloriasMeta = document.getElementById('out_caloriasMeta');
     out_caloriasMeta.innerText = "Tus calorias meta son: " + caloriasMeta.toFixed(0) + ' cal';
 
     var out_proteinas = document.getElementById('out_proteinas');
     out_proteinas.innerText = "Proteinas: " + macronutrientes[0].toFixed(0) + " gr";
 
     var out_carbohidratos = document.getElementById('out_carbohidratos');
     out_carbohidratos.innerText = "Carbohidratos: " + macronutrientes[1].toFixed(0) + " gr";
 
     var out_grasas = document.getElementById('out_grasas');
     out_grasas.innerText = "Grasas: " + macronutrientes[2].toFixed(0) + " gr";
}


