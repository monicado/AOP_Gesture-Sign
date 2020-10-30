//PennController.DebugOff()
PennController.ResetPrefix(null);
PennController.InitiateRecorder("https://mondo1.dreamhosters.com/AudioRecordings/audiouploads.php");

Sequence("Consent", "Counter", "Instructions", "MicCheck", "PreloadVids","Practice", "MainExperiment", SendResults(),"EndScreen")


// Preface
newTrial("Consent",
    newText("InclusionCriteria", "<b>You must be at least 18 years of age & a native speaker of American English to participate in this study.</b>")
    .center()
    .css({"font-size": "36px"})
    .print()
    ,
    newImage("Consent","https://mondo1.dreamhosters.com/MTurkOnlineConsent_English_45mins.jpg")
    .settings.size(794, 1123)
    .print()
    .center()
    ,
    newCanvas("agree", 800, 400)
    .add(200, 0, newButton("Agree", "I agree"))
    .add(400, 0, newButton("Disagree", "I do NOT agree"))
    .center()
    .print()
    ,
    newSelector("consentselect")
    .add(getButton("Agree"), getButton("Disagree"))
    .settings.log("all")
    .wait()
    ,
    getSelector("consentselect")
    .test.selected(getButton("Agree"))
    .success(
        getImage("Consent")
        .remove()
        ,
        getSelector("consentselect")
        .remove()
        ,
        getCanvas("agree")
        .remove()
        )
    .failure(
        getImage("Consent")
        .remove()
        ,
        getSelector("consentselect")
        .remove()
        ,
        getCanvas("agree")
        .remove()
        ,
        newText("Exit", "You may exit the experiment by closing the window. Thank you for your consideration.")
        .print()
        .center()
        .css({"font-size": "24px"})
        .wait()
        )
)

SetCounter("Counter", "inc", 1)

newTrial("Instructions",
    newText("InstructHeader", "INSTRUCTIONS")
    .center()
    .bold()
    .css({"font-size": "24px"})
    .print()
    ,
    newText("instruct","<p>In this experiment, you will watch some short video clips and then describe what happened in the video out loud. </p><p>There is no time limit or limitation on the number of words you can use. </p><p>Your recording will start automatically. When you are done speaking, press ‘Stop Recording’ to go to the next trial.</p><p>Before we begin, you will have the opportunity to go through three practice items. </p> <p> First, you will do a mic check.</p>")
      .center()
      .css({"font-size": "24px"})
      .print()
    ,
    newButton("ContinuetoCheck", "Continue")
        .settings.center()
        .print()
        .wait()
        .remove()
);

newTrial("MicCheck",
    newText("MicTest", "<p>Before we begin, please test your mic for the experiment. If you cannot hear or make out your recordings, neither can we and unfortunately, you will not be able to approve your HIT.</p> <p>Say <i>The quick brown fox jumps over the lazy dog.</i></p> <p>Press the <i>Record</i> button to start recording. Press it again to stop your recording. Press play to hear your recording.</p>")
        .settings.center()
        .css({"font-size": "24px"})
        .print()
    ,
    newVoiceRecorder("MicCheck")
        .settings.center()
        .print()
    ,
    newButton("ContinueExamples", "Continue to example items.")
        .settings.center()
        .print()
        .wait()
        .remove()
).setOption("hideProgressBar",true);

PennController.PreloadZip("https://mondo1.dreamhosters.com/SoGo_AnimXPred_List1Items.zip")

PennController.CheckPreloaded(3*60*1000) // wait up to 3 minutes for preload
    .label("PreloadVids")

const replacePreloadingMessage = ()=>{
    const preloadingMessage = $(".PennController-PennController > div");
    if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
        preloadingMessage.html("<p>Please wait while the experiment is loading. This may take a few minutes.</p>");
    window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

PennController.Template("PracticeItems.csv" ,
    row => PennController(
      newTrial("Practice",
        newText("PracHeader", row.ItemNumb)
        .settings.css("font-size", "34px")
        .settings.css("color", "black")
        .settings.bold()
        .settings.center()
        .settings.css("margin-top", "30px")
        .print()
        ,
        newVideo("PracVid", row.VidID)
        .settings.size(1000, 500)           // Size depends on the dimensions of the video. Change if needed.
        .print()
        ,
        newFunction( ()=>getVideo("PracVid")._element.jQueryElement.removeAttr("controls") ).call()
        ,
        getVideo("PracVid")
        .play()
        .wait()
        ,
        newText("Speak","Your recording has started. Say a sentence that describes what happened. Then, press <b>Continue</b> to see the next item.")
        .settings.css("font-size", "34px")
        .center()
        .print()
        .wait()
        ,
        newButton("Continue", "Continue")
        .print()
        .wait()
        .remove()
        ,
        getVideo("PracVid")
        .remove()
        ,
        getText("Prac1Header")
        .remove()
        ,
        getText("Speak")
        .remove()
      )
  )
);

newTrial("MainExperimentStart",
  newText("ExperimentStart", "We are now ready to start the main experiment. Press <i>Start</i> to begin.")
  .center()
  .css({"font-size": "24px"})
  .print()
  ,
  newButton("Start Experiment")
  .center()
  .print()
  .wait()
  ,
  getText("ExperimentStart")
  .remove()
);


// MAIN EXPERIMENT USING PENNCONTROLLER.TEMPLATE
PennController.Template("sogo_itemList1.csv" ,
    row => PennController(
      newTrial("Main Experiment",
        newVideo("TargetVid", row.TargID)    // variable.URLName doesn't exist yet. URL for the video
        .settings.size(1000,500)
        .print()
        ,
        newFunction( ()=>getVideo("TargetVid")._element.jQueryElement.removeAttr("controls") ).call()
        ,
        getVideo("TargetVid")
        .play()
        .wait()
        .remove()
        ,
        newVoiceRecorder("recorder")
        .record()
        ,
        newButton("EndTrial", "End Recording & Continue")
        .settings.center()
        .print()
        .wait()
        ,
        getVoiceRecorder("recorder")
        .stop()
        .remove()
        ,
        getVideo("TargetVid")
	      .remove()
      )
.log( "ItemID" , row.TargID )
.log( "OrderID" , row.OrderID)
.log("ConditionID", row.ConditionID)
  )
);

PennController.SendResults();


//UPLOAD INSTRUCTIONS FIX THIS
PennController(
    newText("upload","<p>If your upload has been interrupted, you may download your recording file and email it to the University of Chicago's Language Processing Lab at monicado@uchicago.edu.</p>")
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


newTrial("EndScreen",
    newText("<p>Thank you for your participation! If you have questions about this research, or if you would like to receive a report of this research when it is completed, you may contact the researcher Monica Do at monicado@uchicago.edu.</p><p><b>Please enter the following code on mturk to receive credit: 65836504 </b></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
).setOption("hideProgressBar",true);
