function shuffleArray(array) {
    for (let i = array.length -1 ; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
module.exports.index= async function(req,res,next){
    var number=req.query.number;
    var arr=[];
    var j=0;
    for(var i=1;i<= number;i++){
        arr[j++]=i;
    }
    var newArr=shuffleArray(arr);
    res.json({
        newArr
    });
    
};