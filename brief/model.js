/* Pure routing. Human review is always required; no score or automatic rejection. */
(function(root){
 'use strict';
 function classify(data={}) {
  const features=Array.isArray(data.features)?data.features:[];
  const languages=Array.isArray(data.languages)?data.languages:[];
  if (features.some(f=>['shop','booking','payment','integration'].includes(f)) || languages.length>2) {
   return {route:'custom',message:'La petición requiere un presupuesto a medida. Lareira revisará el alcance contigo.'};
  }
  if (!features.includes('presentation') || features.includes('unknown') || data.budget!=='yes' || !data.goal || data.goal==='unknown') {
   return {route:'clarify',message:'Conviene hablar para aclarar lo que necesitas. La solicitud queda pendiente de revisión por Lareira.'};
  }
  return {route:'base',message:'Petición de web de presentación, pendiente de revisión por Lareira.'};
 }
 root.LareiraBrief=Object.freeze({classify});
})(globalThis);
