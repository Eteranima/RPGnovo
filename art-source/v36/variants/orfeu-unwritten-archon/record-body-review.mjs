import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,''));
const root=path.resolve(dir,'../../../..');
const record={id:'orfeu-unwritten-archon',coordinates:'absolute native source pixels',direction:'Short white hair, warm golden tan skin, fully covered indigo-black-gold martial attire',manualHeadTopOverrides:{},metrics:[],anchors:'Automatic foot-band anchors reviewed. Seven wide lunges use equal average of the two boot alpha centroids, preserving actual lowest sole.',notes:['All32body native crops and12VFX/icon native crops inspected individually.','Ultimate5headTop603 excludes the physical black-gold seal debris above the hair; remaining tops are the actual hair/temple ornament top.','Walk source directions SOUTH/WEST/EAST/NORTH, direct playback.','Strongest ultimate palm contact native5. Attack/cast contact native3.','Cast row1 boundary575 separates full contact3debris from actor4. Default nearest divider464 had incorrectly assigned the contact3fragments to4; no RGBA alteration was needed.','Source images and native crops are not resized, repainted or alpha-masked.','No extra limb/digit or clipping defect found in this review; natural profile occlusion may hide the far hand. This is not a claim of absolute perfection or user visual approval.'],reviewStatus:'native-pose-review-complete-no-blocking-defect-found'};
for(const kind of ['walk','attack','cast','ultimate']){
 const m=JSON.parse(await fs.readFile(path.join(dir,kind+'-manifest.json'),'utf8'));
 record.manualHeadTopOverrides[kind]={};
 for(const p of m.measurements){
  const headTop=kind==='ultimate'&&p.i===5?603:p.headOrHatTop;
  record.manualHeadTopOverrides[kind][p.i]=headTop;
  record.metrics.push({kind,index:p.i,headTop,groundSole:p.groundSole,anchorX:p.crop.anchorX,anchorY:p.crop.anchorY,headTopMethod:kind==='ultimate'&&p.i===5?'Manual hair ROI x500..619,y570..689 native alpha>24':'Hair/temple ornament is topmost visible actor part; individually reviewed',anchorMethod:p.anchorMethod,sourceSha256:m.sourceSha256});
 }
}
await fs.writeFile(path.join(dir,'body-metrics.json'),JSON.stringify(record,null,2)+'\n');
const proofPath=path.join(root,'docs/qa-v36/orfeu-art.json');
const proof=JSON.parse(await fs.readFile(proofPath,'utf8'));proof.direction=record.direction;proof.visualReviewStatus=record.reviewStatus;proof.userApprovalStatus='pending-root-user-review';proof.bodyMetricsSource='art-source/v36/variants/orfeu-unwritten-archon/body-metrics.json';proof.bodyMetricsSha256=crypto.createHash('sha256').update(await fs.readFile(path.join(dir,'body-metrics.json'))).digest('hex');proof.notes.push(...record.notes);
await fs.writeFile(proofPath,JSON.stringify(proof,null,2)+'\n');
console.log(JSON.stringify({bodyMetrics:record.metrics.length,allNativeCropsReviewed:proof.totalAtlasFrames,headTopUltimate5:603,castCuts:[0,575,1025,1536],reviewStatus:record.reviewStatus}));
