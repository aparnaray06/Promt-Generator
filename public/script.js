const mood = document.getElementById("mood");
const generateBtn = document.getElementById("generateBtn");
const prompt = document.getElementById("prompt");

generateBtn.addEventListener("click", async ()=>{
    const selectMood = mood.value;

    if(!selectMood){
        prompt.textContent = 'please select your mood';
        return;
    }
    prompt.textContent = 'generating your journal prompt...';

    try{
        const response = await fetch('/journal-prompt',{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                mood: selectMood
            })
        });
        const data = await response.json()
        if(!response.ok){
                throw new Error(data.error || "something went wrong");
            }
            prompt.textContent = data.prompt;

        }catch(error){
        console.log(error);
        prompt.textContent='unable to generate prompt. please try again.'
    }
})


