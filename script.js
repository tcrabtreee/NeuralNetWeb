function processor(processor){
    if(processor === "cpu"){
        ml5.tf.setBackend("cpu")
        console.log("cpu")
    } else {
        ml5.tf.setBackend("webgl")
        console.log("webgl")
    }
}

var options = {
    dataUrl: "",
    task: '',
    inputs: [],
    outputs: [],
}

var startTime = null
function predict(){
    startTime = Date.now()
    document.getElementById("progress").innerText = `Progress: Started.`
    document.getElementById("result").innerText = `Result:`
    options.dataUrl = document.getElementById("dataurlinput").value
    options.task = document.getElementById("typeSelect").value

    let inputs = document.getElementsByClassName("input")
    let actual_inputs = []

    for(let i = 0; i < inputs.length; i++){
        if(inputs[i].value !== ""){
            actual_inputs.push(inputs[i].value)
        }
    }

    options.inputs = actual_inputs

    let outputs = document.getElementsByClassName("output")
    let actual_outputs = []

    for(let i = 0; i < outputs.length; i++){
        if(outputs[i].value !== ""){
            actual_outputs.push(outputs[i].value)
        }
    }

    options.outputs = actual_outputs

    const nn = ml5.neuralNetwork(options, normalizeData);

    function normalizeData(){
        document.getElementById("progress").innerText = `Progress: Normalizing Data...`
        nn.normalizeData();
        trainModel();
    }

    function trainModel(){
        document.getElementById("progress").innerText = `Progress: Training Model...`
        console.log(parseInt(document.getElementById("epochsNum").value))
        const trainingOptions = {
        epochs: parseInt(document.getElementById("epochsNum").value),
        batchSize: parseInt(document.getElementById("batchSizeNum").value)
        }
        nn.train(trainingOptions, classify)
    }

    function classify(){
        if(document.getElementById("typeSelect").value === "classification") document.getElementById("progress").innerText = `Progress: Classifying...`
        if(document.getElementById("typeSelect").value === "regression") document.getElementById("progress").innerText = `Progress: Predicting...`
        let preinputs = document.getElementsByClassName("preinput")
        let actual_preinputs = []
    
        for(let i = 0; i < preinputs.length; i++){
            if(preinputs[i].value !== ""){
                actual_preinputs.push(preinputs[i].value)
            }
        }

        var predictinput = Object.fromEntries(actual_inputs.map((key, index) => [key, parseInt(actual_preinputs[index])]));
        console.log(predictinput)
        
        // const input = {
        //     r: 230, 
        //     g: 0, 
        //     b: 0,
        //   }
        const input = predictinput;
        if(document.getElementById("typeSelect").value === "classification") nn.classify(input, handleResults)
        if(document.getElementById("typeSelect").value === "regression") nn.predict(input, handleResults)
    }

    function handleResults(error, result){
        if(error){
            console.error(error);
            document.getElementById("progress").innerText = `Progress: Error! Check console.`
            return;
        }
        console.log(result);
        document.getElementById("progress").innerText = `Progress: Done! (${(Date.now() - startTime) / 1000} s)`
        document.getElementById("result").innerText = `Result: ${result[0].label}`
    }
}