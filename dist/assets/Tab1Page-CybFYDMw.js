import{I as K,a as ee,b as te,c as ae,d as oe,e as ne,f as re,g as se,h as ie,i as le,j as ue,k as ce,l as de,m as ge,r as p,n as pe,v as me,s as he,o as C,p as w,q as o,w as n,F as fe,t as m,u as k,x as u,y as A,z as ye,A as U,B as ve}from"./index-DghsO6hh.js";import{_ as be}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Se={components:{IonPage:K,IonHeader:ee,IonToolbar:te,IonTitle:ae,IonContent:oe,IonButton:ne,IonItem:re,IonLabel:se,IonInput:ie,IonTextarea:le,IonSpinner:ue,IonSelect:ce,IonSelectOption:de,IonIcon:ge},setup(){const y=p("Luna"),e=p("girl"),B=p("forêt magique"),a=p("peut parler aux animaux"),_=p("friendship"),I=p("french"),V=p("Elle a un pendentif magique qui brille quand les animaux sont proches. Elle aime aider les créatures perdues à retrouver leur chemin."),W=p(!1),j=p(""),v=p(!1),b=p(0),d=p([]),g=p({}),x=p(""),F=p(!1),P=p(!1),S=window.speechSynthesis;let h=null;const N=t=>{const i=t.split(`
`);x.value=i[0];const l=i.slice(1).join(`
`).split(`

`).filter(q=>q.trim()),r=[],f=l.length,T=Math.ceil(f/5);for(let q=0;q<5;q++){const L=q*T,R=L+T,Z=l.slice(L,R).join(`

`);r.push(Z||"Page under construction...")}return r},D=async()=>{try{const t=`Create a detailed, consistent character description for a children's book illustration:

Main Character Basic Info:
- Name: ${y.value}
- Gender: ${e.value}
- Special ability: ${a.value}
- Setting: ${B.value}
- Additional details: ${V.value}

Please provide a detailed visual description including:
1. Physical appearance (age, height, build)
2. Facial features (eyes, smile, expressions)
3. Hair style and color
4. Clothing style and colors (signature outfit)
5. Distinguishing accessories or items
6. Personality reflected in posture and movement
7. Special visual elements related to their ability
8. Color palette associated with the character

Format the description to be used as a reference for consistent illustration across multiple scenes.`;return(await(await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"user",content:t}],temperature:.7,max_tokens:500})})).json()).choices[0].message.content}catch(t){return console.error("Error generating character description:",t),null}},c=async(t,i=3,s=2e3)=>{for(let l=0;l<i;l++)try{return await t()}catch(r){if(l===i-1)throw r;console.log(`Attempt ${l+1} failed, retrying in ${s}ms...`),await new Promise(f=>setTimeout(f,s))}},M=async(t,i)=>{try{const s=`Analyze this page content from a children's story and extract key visual elements:
${t}

Please describe:
1. What is the main action happening?
2. What is the emotional state of the character?
3. What are the key elements of the scene?
4. What time of day/lighting would best suit this moment?
5. What should be the focal point of the illustration?

Format the response in clear, visual terms that can be used for image generation.`;return(await(await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"user",content:s}],temperature:.7,max_tokens:300})})).json()).choices[0].message.content}catch(s){return console.error("Error analyzing page content:",s),null}},z=async()=>{const t=await c(D);if(!t){console.error("Failed to generate character description after retries");return}for(let i=0;i<d.value.length;i++)try{const s=await c(()=>M(d.value[i],i+1));if(!s)throw new Error("Failed to analyze page content");const r=await c(async()=>{const f=`Create a single illustration for a children's book (absolutely no text or words in the image):

Character Details (maintain this exact appearance throughout the story):
${t}

Scene Analysis:
${s}

Artistic Requirements:
- Style: Modern Disney/Pixar 3D animation quality
- Composition: Dynamic and engaging, following rule of thirds
- Lighting: Match the scene's mood and time of day
- Colors: Rich, vibrant, and harmonious
- Focus: Clear hierarchy with main action prominent
- Details: Rich but not overwhelming background elements
- NO TEXT whatsoever in the image

Technical Specifications:
- High detail in character features
- Strong silhouettes
- Clear foreground/middle-ground/background separation
- Smooth color transitions
- Cinematic framing
- Emotional storytelling through visuals only

This is page ${i+1} of 5 - ensure the character's appearance matches exactly across all pages while the pose and expression match this specific moment.`.slice(0,1e3),T=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({prompt:f,n:1,size:"512x512",response_format:"url",quality:"hd",style:"vivid"})});if(!T.ok)throw new Error("Failed to generate image");return(await T.json()).data[0].url});g.value[i]=r,i<d.value.length-1&&await new Promise(f=>setTimeout(f,1e3))}catch(s){console.error(`Failed to generate image for page ${i+1}:`,s),g.value[i]=null}},J=t=>{const i={french:{title:"Créez une histoire pour enfants en 5 pages avec les spécifications suivantes:",character:"Personnage:",name:"Nom",gender:"Genre",ability:"Capacité Spéciale",setting:"Cadre",theme:"Thème",details:"Détails Supplémentaires",structure:{title:"Structure de l'Histoire:",page1:{title:"Page 1: Introduction",bullets:[`Présenter ${y.value} et le cadre`,"Montrer la capacité spéciale du personnage","Établir la situation initiale"]},page2:{title:"Page 2: Apparition du Défi",bullets:["Présenter un problème ou un défi",`Montrer comment cela affecte ${y.value} ou les autres`,"Créer de la tension"]},page3:{title:"Page 3: Tentatives et Difficultés",bullets:[`Montrer ${y.value} essayant de résoudre le problème`,"Utiliser sa capacité spéciale","Inclure quelques obstacles"]},page4:{title:"Page 4: Apprentissage et Croissance",bullets:["Le personnage apprend quelque chose d'important","Montrer une évolution personnelle","Commencer à résoudre le conflit"]},page5:{title:"Page 5: Résolution",bullets:["Résoudre le problème principal",`Montrer comment ${y.value} a changé`,`Terminer avec une morale sur ${_.value}`]}},style:{title:"Style d'Écriture:",bullets:["Utiliser un langage simple et clair pour les 5-8 ans","Inclure des dialogues et des scènes descriptives","Ajouter des répétitions ludiques ou des phrases récurrentes","Garder des paragraphes courts et engageants","Utiliser la voix active et le présent"]},format:{title:"Format:",bullets:["Commencer par un titre accrocheur","Séparer chaque page par deux sauts de ligne","Chaque page doit avoir une longueur similaire",`Terminer par une morale claire sur ${_.value}`]},wordCount:"L'histoire complète doit faire entre 1000 et 1200 mots, répartis équitablement sur les 5 pages."},english:{title:"Create a 5-page children's story with the following specifications:",character:"Character:",name:"Name",gender:"Gender",ability:"Special Ability",setting:"Setting",theme:"Theme",details:"Additional Details",structure:{title:"Story Structure:",page1:{title:"Page 1: Introduction",bullets:[`Introduce ${y.value} and the setting`,"Show the character's special ability","Set up the initial situation"]},page2:{title:"Page 2: Challenge Appears",bullets:["Present a problem or challenge",`Show how it affects ${y.value} or others`,"Build tension"]},page3:{title:"Page 3: Attempts and Struggles",bullets:[`Show ${y.value} trying to solve the problem`,"Use their special ability","Include some setbacks"]},page4:{title:"Page 4: Learning and Growth",bullets:["Character learns something important","Show personal growth","Begin to resolve the conflict"]},page5:{title:"Page 5: Resolution",bullets:["Solve the main problem",`Show how ${y.value} has changed`,`End with a clear moral lesson about ${_.value}`]}},style:{title:"Writing Style:",bullets:["Use simple, clear language for ages 5-8","Include dialogue and descriptive scenes","Add playful repetition or catchphrases","Keep paragraphs short and engaging","Use active voice and present tense"]},format:{title:"Format:",bullets:["Start with a catchy title","Separate each page with two newlines","Each page should be roughly equal in length",`End with a clear moral lesson about ${_.value}`]},wordCount:"The total story should be between 1000-1200 words, evenly distributed across the 5 pages."},spanish:{}};return i[t]||i.english},Q=async()=>{try{v.value=!0,W.value=!0;const t=J(I.value),i=`${t.title}

${t.character}
- ${t.name}: ${y.value}
- ${t.gender}: ${e.value}
- ${t.ability}: ${a.value}

${t.setting}: ${B.value}
${t.theme}: ${_.value}
${t.details}: ${V.value}

${t.structure.title}
${t.structure.page1.title}
${t.structure.page1.bullets.map(r=>`- ${r}`).join(`
`)}

${t.structure.page2.title}
${t.structure.page2.bullets.map(r=>`- ${r}`).join(`
`)}

${t.structure.page3.title}
${t.structure.page3.bullets.map(r=>`- ${r}`).join(`
`)}

${t.structure.page4.title}
${t.structure.page4.bullets.map(r=>`- ${r}`).join(`
`)}

${t.structure.page5.title}
${t.structure.page5.bullets.map(r=>`- ${r}`).join(`
`)}

${t.style.title}
${t.style.bullets.map(r=>`- ${r}`).join(`
`)}

${t.format.title}
${t.format.bullets.map(r=>`- ${r}`).join(`
`)}

${t.wordCount}`,s=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"user",content:i}],temperature:.8,max_tokens:1500})});if(!s.ok){const r=await s.text();throw console.error("Error response:",r),new Error(`HTTP error! status: ${s.status}, body: ${r}`)}const l=await s.json();if(l.choices&&l.choices[0]&&l.choices[0].message){const r=l.choices[0].message.content;d.value=N(r),b.value=0,g.value={},v.value=!1,z().catch(f=>{console.error("Error generating images:",f)})}else throw new Error("Unexpected API response structure")}catch(t){console.error("Full error details:",t),j.value=`Error: ${t.message||"Unknown error occurred"}`}finally{v.value=!1}},E=()=>{$(),b.value<d.value.length-1&&b.value++},G=()=>{$(),b.value>0&&b.value--},$=()=>{S.speaking&&S.cancel(),P.value=!1},H=t=>{const i=S.getVoices(),s=i.filter(l=>l.lang.startsWith(t)&&(l.name.includes("Neural")||l.name.includes("Premium")||l.name.includes("Enhanced")||l.name.includes("Natural")));return s.length===0?i.find(l=>l.lang.startsWith(t)):s[0]},O=t=>t.replace(/&nbsp;/g," ").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").replace(/[^\w\s.,!?'"-]/g," ").replace(/\s+/g," ").trim(),X=()=>{if(P.value){$();return}let t=d.value[b.value];if(!t)return;t=O(t),new Promise(s=>{S.getVoices().length?s():S.onvoiceschanged=()=>s()}).then(()=>{h=new SpeechSynthesisUtterance(t);const s=I.value==="french"?"fr-FR":I.value==="spanish"?"es-ES":"en-US";h.lang=s;const l=H(s);l&&(h.voice=l),h.rate=.9,h.pitch=1,h.volume=1;const r=t.match(/[^.!?]+[.!?]+/g)||[t];h.text=r.join(" "),h.onend=()=>{P.value=!1,b.value<d.value.length-1&&setTimeout(()=>E(),1e3)},h.onerror=f=>{console.error("Speech synthesis error:",f),P.value=!1},h.onboundary=f=>{f.name==="sentence"&&(S.pause(),setTimeout(()=>S.resume(),250))},S.speak(h),P.value=!0})},Y=pe(()=>S.getVoices().map(t=>({name:t.name,lang:t.lang,isNeural:t.name.includes("Neural")})));return{heroName:y,heroGender:e,setting:B,specialQuality:a,theme:_,language:I,additionalDetails:V,submitted:W,handleSubmit:Q,story:j,isLoading:v,currentPage:b,storyPages:d,pageImages:g,storyTitle:x,isGeneratingImage:F,nextPage:E,previousPage:G,isSpeaking:P,readPage:X,stopSpeaking:$,volumeHigh:me,stopCircle:he,availableVoices:Y}}},we={key:0},Pe={key:1,class:"story-container"},ke={key:1},_e={class:"story-navigation"},Ce={class:"story-page"},Ae={key:0},xe={class:"story-content"},qe={class:"story-image-container"},Ie={key:0,class:"story-image"},Ve=["src","alt"],Te={key:1,class:"image-loading"},Be={class:"story-text-container"},We={class:"story-text"},je={class:"audio-controls"};function $e(y,e,B,a,_,I){const V=m("ion-title"),W=m("ion-toolbar"),j=m("ion-header"),v=m("ion-label"),b=m("ion-input"),d=m("ion-item"),g=m("ion-select-option"),x=m("ion-select"),F=m("ion-textarea"),P=m("ion-button"),S=m("ion-spinner"),h=m("ion-icon"),N=m("ion-content"),D=m("ion-page");return k(),C(fe,null,[e[30]||(e[30]=w("link",{href:"https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Short+Stack&display=swap",rel:"stylesheet"},null,-1)),o(D,null,{default:n(()=>[o(j,null,{default:n(()=>[o(W,null,{default:n(()=>[o(V,null,{default:n(()=>e[9]||(e[9]=[u("Create Your Hero's Story")])),_:1})]),_:1})]),_:1}),o(N,{class:"ion-padding"},{default:n(()=>[a.submitted?U("",!0):(k(),C("div",we,[w("form",{onSubmit:e[7]||(e[7]=ye((...c)=>a.handleSubmit&&a.handleSubmit(...c),["prevent"]))},[o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[10]||(e[10]=[u("Hero Name")])),_:1}),o(b,{modelValue:a.heroName,"onUpdate:modelValue":e[0]||(e[0]=c=>a.heroName=c),required:""},null,8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[11]||(e[11]=[u("Hero Gender")])),_:1}),o(x,{modelValue:a.heroGender,"onUpdate:modelValue":e[1]||(e[1]=c=>a.heroGender=c),required:""},{default:n(()=>[o(g,{value:"boy"},{default:n(()=>e[12]||(e[12]=[u("Boy")])),_:1}),o(g,{value:"girl"},{default:n(()=>e[13]||(e[13]=[u("Girl")])),_:1}),o(g,{value:"neutral"},{default:n(()=>e[14]||(e[14]=[u("Gender Neutral")])),_:1})]),_:1},8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[15]||(e[15]=[u("Setting")])),_:1}),o(b,{modelValue:a.setting,"onUpdate:modelValue":e[2]||(e[2]=c=>a.setting=c),placeholder:"e.g., magical forest, space station, underwater city",required:""},null,8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[16]||(e[16]=[u("Hero's Special Quality")])),_:1}),o(b,{modelValue:a.specialQuality,"onUpdate:modelValue":e[3]||(e[3]=c=>a.specialQuality=c),placeholder:"e.g., can talk to animals, very brave, super smart",required:""},null,8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[17]||(e[17]=[u("Story Theme")])),_:1}),o(x,{modelValue:a.theme,"onUpdate:modelValue":e[4]||(e[4]=c=>a.theme=c),required:""},{default:n(()=>[o(g,{value:"friendship"},{default:n(()=>e[18]||(e[18]=[u("Friendship")])),_:1}),o(g,{value:"courage"},{default:n(()=>e[19]||(e[19]=[u("Courage")])),_:1}),o(g,{value:"kindness"},{default:n(()=>e[20]||(e[20]=[u("Kindness")])),_:1}),o(g,{value:"perseverance"},{default:n(()=>e[21]||(e[21]=[u("Never Give Up")])),_:1}),o(g,{value:"creativity"},{default:n(()=>e[22]||(e[22]=[u("Creative Problem Solving")])),_:1})]),_:1},8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[23]||(e[23]=[u("Language / Langue")])),_:1}),o(x,{modelValue:a.language,"onUpdate:modelValue":e[5]||(e[5]=c=>a.language=c),required:""},{default:n(()=>[o(g,{value:"french"},{default:n(()=>e[24]||(e[24]=[u("Français")])),_:1}),o(g,{value:"english"},{default:n(()=>e[25]||(e[25]=[u("English")])),_:1}),o(g,{value:"spanish"},{default:n(()=>e[26]||(e[26]=[u("Español")])),_:1})]),_:1},8,["modelValue"])]),_:1}),o(d,null,{default:n(()=>[o(v,{position:"floating"},{default:n(()=>e[27]||(e[27]=[u("Additional Details")])),_:1}),o(F,{modelValue:a.additionalDetails,"onUpdate:modelValue":e[6]||(e[6]=c=>a.additionalDetails=c),rows:"3",placeholder:"Any other details about your hero or the story"},null,8,["modelValue"])]),_:1}),o(P,{type:"submit",expand:"block",class:"ion-margin-top submit-button",disabled:a.isLoading},{default:n(()=>[u(A(a.isLoading?"Creating Story...":"Create a Story"),1)]),_:1},8,["disabled"])],32)])),a.submitted?(k(),C("div",Pe,[a.isLoading?(k(),ve(S,{key:0,class:"spinner-center"})):(k(),C("div",ke,[w("div",_e,[o(P,{onClick:a.previousPage,disabled:a.currentPage===0,class:"nav-button"},{default:n(()=>e[28]||(e[28]=[u(" Previous ")])),_:1},8,["onClick","disabled"]),w("span",null,"Page "+A(a.currentPage+1)+" of "+A(a.storyPages.length),1),o(P,{onClick:a.nextPage,disabled:a.currentPage===a.storyPages.length-1,class:"nav-button"},{default:n(()=>e[29]||(e[29]=[u(" Next ")])),_:1},8,["onClick","disabled"])]),w("div",Ce,[a.currentPage===0?(k(),C("h2",Ae,A(a.storyTitle),1)):U("",!0),w("div",xe,[w("div",qe,[a.pageImages[a.currentPage]?(k(),C("div",Ie,[w("img",{src:a.pageImages[a.currentPage],alt:`Illustration for page ${a.currentPage+1}`,onError:e[8]||(e[8]=c=>a.pageImages[a.currentPage]=null)},null,40,Ve)])):(k(),C("div",Te,[o(S),w("p",null,"Generating illustration for page "+A(a.currentPage+1)+"...",1)]))]),w("div",Be,[w("p",We,A(a.storyPages[a.currentPage]),1),w("div",je,[o(P,{onClick:a.readPage,color:a.isSpeaking?"danger":"primary",class:"read-button"},{default:n(()=>[o(h,{icon:a.isSpeaking?"stop-circle":"volume-high",slot:"start"},null,8,["icon"]),u(" "+A(a.isSpeaking?"Stop Reading":"Read Aloud"),1)]),_:1},8,["onClick","color"])])])])])]))])):U("",!0)]),_:1})]),_:1})],64)}const De=be(Se,[["render",$e],["__scopeId","data-v-e322628b"]]);export{De as default};
