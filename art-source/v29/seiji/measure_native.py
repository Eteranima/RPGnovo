"""Read alpha component bounds without changing any generated pixels."""
from PIL import Image
import numpy as np
from pathlib import Path
import json, sys

def components(alpha, threshold=32, min_pixels=10000):
    parents=[]; bounds=[]; pixels=[]; previous=[]
    def find(i):
        while parents[i]!=i:
            parents[i]=parents[parents[i]];i=parents[i]
        return i
    def join(a,b):
        a,b=find(a),find(b)
        if a!=b:
            parents[b]=a
            ba,bb=bounds[a],bounds[b]
            bounds[a]=[min(ba[0],bb[0]),min(ba[1],bb[1]),max(ba[2],bb[2]),max(ba[3],bb[3])]
            pixels[a]+=pixels[b]
        return a
    for y,row in enumerate(alpha>threshold):
        edges=np.diff(np.r_[False,row,False].astype(np.int8))
        starts=np.flatnonzero(edges==1);ends=np.flatnonzero(edges==-1)
        current=[]; cursor=0
        for x,end in zip(starts,ends):
            while cursor<len(previous) and previous[cursor][1]<x-1:cursor+=1
            touching=[];j=cursor
            while j<len(previous) and previous[j][0]<=end:
                px,pe,idx=previous[j]
                if pe>=x:touching.append(idx)
                j+=1
            if touching:
                idx=find(touching[0])
                for other in touching[1:]:idx=join(idx,other)
                bb=bounds[idx];bb[0]=min(bb[0],int(x));bb[2]=max(bb[2],int(end));bb[3]=y+1
                pixels[idx]+=int(end-x)
            else:
                idx=len(parents);parents.append(idx);bounds.append([int(x),y,int(end),y+1]);pixels.append(int(end-x))
            current.append((int(x),int(end),idx))
        previous=current
    return [dict(x=bounds[i][0],y=bounds[i][1],w=bounds[i][2]-bounds[i][0],h=bounds[i][3]-bounds[i][1],pixels=pixels[i]) for i in range(len(parents)) if find(i)==i and pixels[i]>=min_pixels]

if __name__=="__main__":
    for path in map(Path,sys.argv[1:]):
        im=Image.open(path);a=np.asarray(im.getchannel("A"))
        print(json.dumps(dict(path=str(path),size=im.size,alpha0=round(float((a==0).mean()*100),2),components=components(a))))
