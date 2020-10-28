//PennController.DebugOff()
PennController.ResetPrefix(null);
PennController.InitiateRecorder("https://mondo1.dreamhosters.com/AudioRecordings/audiouploads.php");

// PREFACE PAGE
PennController(
    newText("consent", "<p>You have been invited to take part in a research study about how people produce sentences. The study is being conducted by the Language Processing and Language Development Lab at the University of Pennsylvania.</p><p>You are being asked to complete this experiment because you are an adult (18 years or older) and you are native speaker of English (you learned English from birth and are a fluent speaker of English).</p><p>You will be asked to record your utterances in this study, so you must have a working microphone to participate. Your voice recordings and any information that you provide will be anonymous and kept confidential. You may withdraw from this study at any time without penalty. However, make sure you have a reliable internet connection and are able to complete the study in one sitting as too many missed trials can affect payment.</p><p>If you have questions about this research, or if you would like to receive a report of this research when it is completed, please contact the researcher Monica Do at monicado@sas.upenn.edu.</p><p><b>This study takes approximately 30 minutes</b> and you will be paid $5 for your participation.</p><p>By clicking 'I agree', you agree that you are <b>at least 18 years of age, that you are a native speaker of English, and that you understand these instructions and conditions of participation.</b></p>")
        .print()
    ,
    newButton("I agree")
        .print()
        .wait()
        .remove()
    ,
    getText("consent")
        .remove()
    ,
    newText("instruct","<p>In this experiment, you will first watch some short, animated video clips. Once the animation is complete, you will describe what happened in the video to the person you see on the screen. The person you are talking to will be able to see some parts of each video –including the very beginning scene of each clip, <bold>but they are not allowed to see the rest of the video unfold.</bold></p><p>Your partner will let you know when they are finished viewing the beginning scene of each clip. Then, the animation will automatically start. There is no time limit or limitation on the number of words you can use. </p><p>Your recording will start automatically. When you are done speaking, press ‘Stop Recording’ to go to the next trial.</p><p>Before we begin, you do a mic check.</p>")   // Enter Instructions for the experiment here
        .print()
    ,
    getText("instruct")
        .remove()
    ,
    newText("IDenter","<p>Enter your MTurk ID.</p>")
        .settings.center()
        .print()
    ,
    newTextInput("ID")
        .settings.center()
        .print()
    ,
    newVar("ID")
    .settings.global()
    .set( getTextInput("ID") )
    ,
    getText("quickbrown")
        .remove
    ,
    newText("quickbrown", "<p></p>Please test your mic for the experiment. If you cannot hear or make out your recording, neither can we and unfortunately, you will not be approved for payment. Say <i>The quick brown fox jumps over the lazy dog.</i> <p>Press the red record button to start recording. Press it again to stop your recording. Press play to hear your recording." )
        .settings.center()
        .print()
    ,
    newVoiceRecorder("mictest")
        .settings.center()
        .print()
    ,
    newButton("send", "Continue to example item.")
        .settings.center()
        .print()
        .wait()
    ,
    getText("IDenter")
        .remove()
    ,
    getTextInput("ID")
        .remove()
)
.log( "ID" , getVar("ID") );


PennController.PreloadZip("https://mondo1.dreamhosters.com/SoGo_AnimXPred_List1Items.zip")

PennController.CheckPreloaded(3*60*1000) // wait up to 3 minutes for preload
    .label("PreloadImages")

const replacePreloadingMessage = ()=>{
    const preloadingMessage = $(".PennController-PennController > div");
    if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
        preloadingMessage.html("<p>Please wait while the experiment is loading. This may take a few minutes.</p>");
    window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

//Example videos
    newVideo("example", "ExampleItem_pres.mp4")
    .settings.size(1000, 500)           // Size depends on the dimensions of the video. Change if needed.
    .print()
    ,
    newFunction( ()=>getVideo("example")._element.jQueryElement.removeAttr("controls") ).call()
    ,
    newText("exText1", "This is an example item.")
        .settings.css("font-size", "34px")
        .settings.css("color", "black")
        .settings.bold()
        .settings.center()
        .settings.css("margin-top", "30px")
        .print()
    ,
    getVideo("example")
        .play()
        .wait()
        .remove()
    ,
    getText("exText1")
        .remove()
    ,
    newVideo("example_targ", "ExampleItem_anim.mp4")
        .settings.size(1000, 500)           // Size depends on the dimensions of the video. Change if needed.
        .print()
    ,
    newFunction( ()=>getVideo("example_targ")._element.jQueryElement.removeAttr("controls") ).call()
    ,
    newText("exText2", "This is an example item.")
        .settings.css("font-size", "34px")
        .settings.css("color", "black")
        .settings.bold()
        .settings.center()
        .settings.css("margin-top", "30px")
        .print()
    ,
    getVideo("example_targ")
        .play()
        .wait()
        .remove()
    ,
    getText("exText2")
        .remove()
    ,
    newImage("Example_EndStill", "Example_EndStill.jpeg")
        .settings.size(680, 500)
        .settings.center()
        .print()
    ,
    newText("exText3", "For the rest of the experiment, this is where you would start speaking.")
        .settings.center()
        .settings.css("font-size", "34px")
        .settings.css("color", "black")
        .settings.bold()
        .settings.css("margin-top", "30px")
        .print()
    ,
    newTimer("exampleTimer", 5000)
        .start()
        .wait()
    ,
    getText("exText3")
      .remove()
    ,
        getImage("Example_EndStill")
        .remove()
    ,
    newText("<p> We are now ready to start. Videos in this experiment may take some time to load. Please be patient if your page appears to freeze. </p>")
        .print()
    ,
    newButton("Start")
        .print()
        .wait()

// MAIN EXPERIMENT USING PENNCONTROLLER.TEMPLATE
PennController.Template("sogo_itemList1.csv" ,
    row => PennController(
    // MAIN EXPERIMENT PAGE 1
    newVideo("pres", row.PresFilename)    // variable.URLName doesn't exist yet. URL for the video
        .settings.size(1000,500)
        .print()
    ,
    newFunction( ()=>getVideo("pres")._element.jQueryElement.removeAttr("controls") ).call()
    ,
    getVideo("pres")
        .play()
        .wait()
        .remove()
    ,

    // MAIN EXPERIMENT PAGE 2
    newVideo("anim", row.AnimFilename)    // variable.URLName doesn't exist yet. URL for the video
        .settings.size(1000, 500)
        .print()
    ,
    newFunction( ()=>getVideo("anim")._element.jQueryElement.removeAttr("controls") ).call()
    ,
    getVideo("anim")
    .play()
    .wait()
    .remove()
    ,
    newImage("StillImage", row.EndStillFileName)
        .settings.size(680, 500)
        .print()
   ,
    newVoiceRecorder("recorder")
        .record()
    ,
    newButton("Stop recording")
        .settings.center()
        .print()
        .wait()
    ,
    getVoiceRecorder("recorder")
        .stop()
        .remove()
    ,
    getImage("StillImage")
	      .remove()
    )
.log( "ID" , getVar("ID") )
);

PennController.SendResults();


//UPLOAD INSTRUCTIONS FIX THIS
PennController(
    newText("upload","<p>If your upload has been interrupted, you may download your recording file and email it to the University of Pennsylvania's Language Development & Language Processing Lab at monicado@sas.upenn.edu.</p>")
    .print()
    ,
    newText("download", PennController.DownloadVoiceButton("Click here to download an archive of your recordings."))
        .print()
    ,
    newButton("Finish")
        .print()
        .wait()
    ,
    getText("upload")
        .remove()
    ,
    getText("download")
        .remove()
);

// END THANK YOU
PennController(
    newText("<p>Thank you for your participation! Please enter the following code on mturk to receive credit: 51936</p>")
        .print()
    ,
    newButton("void")
        .wait()
).setOption("hideProgressBar",true);        // The progress bar should not be visible for this trial
