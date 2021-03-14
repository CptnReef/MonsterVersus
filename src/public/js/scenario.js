//This data could come from a CMS/editor/any nicer UI for editing game events
var scenarios = [
    {
       //No toys
       "required": [],
       "bypass": ["OneToy"],
       "text": "Rescue the toys."
    },
    {
       //Just one toy: the bone
       "required": ["Bone"],
       "bypass": ["TwoToys"],
       "text": "Ahh yes, the bone!"
    },
    {
       //Any one toy
       "required": ["OneToy"],
       "bypass": ["TwoToys"],
       "text": "This is a good start...",
    },
    {
       //Any two but no rabbit toy
       "required": ["TwoToys"],
       "bypass": ["Rabbit", "ThreeToys"],
       "text": "This is good but have you seen the rabbit?",
    },
    {
       //Any two, one is rabbit
       "required": ["TwoToys"],
       "bypass": ["ThreeToys"],
       "text": "So glad we have the rabbit.",
    },
    {
       //Any three
       "required": ["ThreeToys"],
       "bypass": ["FourToys"],
       "text": "Only one left to go!",
    },
    {
       //All four!
       "required": ["FourToys"],
       "bypass": [],
       "text": "All toys collected!",
    },  
 ]
 
 var computedStoryPoints = {
    "requires": [ "Bone", "Rubber", "Ball", "Rabbit" ],
    "quantities": [
       [1, "OneToy"],
       [2, "TwoToys"],
       [3, "ThreeToys"],
       [4, "FourToys"]
    ]
 }
 
 //Functionality for click binding to add/remove story points
 var toys = document.querySelectorAll(".toy");
 toys.forEach(toy => {
    toy.addEventListener("click", () => {
       toy.classList.toggle("rescued");
       toggleStoryPoint( toy.getAttribute("story-point") )
       refreshScenario();
    })
 });
 
 
 //---------------------- Story Points ---------------------------
 
 //Story point state mechanism
 var storyPoints = {};
 
 function toggleStoryPoint(incomingStoryPoint) {
    //Remove if we had it
    if (storyPoints[incomingStoryPoint]) {
       delete storyPoints[incomingStoryPoint]
    } else {
       //Otherwise, add it
       storyPoints[incomingStoryPoint] = true;
    }
 }
 
 function getAllKnownStoryPoints() { 
    
    //Figure out the computed story points we also own
    var acquiredCount = computedStoryPoints.requires.filter(sp => {
       return storyPoints[sp]
    }).length; //EX: 3
    
    var computed = {};
    computedStoryPoints.quantities.forEach(q => {
       if (acquiredCount >= q[0]) {
          computed[q[1]] = true;
       }
    })
    
    //Combine with all known story points
    return {
       ...storyPoints,
       ...computed
    }
 }
 
 //Update the view
 function refreshScenario() {
    var known = getAllKnownStoryPoints();
    var scenario = scenarios.find(s => {
    
       //Validate that we don't have any bypassers
       for (var i=0; i<=s.bypass.length; i++) {
          if ( known[s.bypass[i]] ) {
             return false;
          }
       }
       
       //Validate that we have all of them
       return s.required.every(entry => known[entry])
    })
    
    document.querySelector(".js-text").textContent = scenario.text;
 }