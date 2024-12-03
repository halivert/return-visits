const s={all:()=>["return-visits"],lists:()=>[...s.all(),"list"],list:l=>[...s.lists(),l],details:()=>[...s.all(),"detail"],detail:(l,t)=>[...s.details(),l,t]};export{s as r};
