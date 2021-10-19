import express, { response } from 'express'
import  axios  from 'axios'

const app :express.Application = express();

app.get("/:name",(req:express.Request,res:express.Response)=>{
     
    axios.get(`https://restcountries.com/v3.1/name/${req.params.name}?fullText=true`)
    .then(
      response => res.json(response.data)
    ).catch(
        () => res.json({'error':'con not find country name'})
    );
     
});

let matches:string[] = ["malta","ger","fr","eng","mor","ha","ita","den"];
app.get("/match/:name",(req:express.Request,res:express.Response)=>{
    axios.get(`https://restcountries.com/v3.1/name/${req.params.name}`)
         .then(response => {
            let data = response.data as any
            let results = Array<{}>()
            for (const elm of data) {
                let elmtemp = elm.name.common as string

                matches.forEach(element => {
                    if(elmtemp.toLocaleLowerCase().includes(element.toLocaleLowerCase())){
                    results.push(elm)
                    }
                });
            
            }
            res.json(results);
        });
     
});


app.get("/game/results",(req:express.Request,res:express.Response)=>{
     
let Reel1 = ["cherry", "lemon", "apple", "banana", "banana", "banana", "lemon", "lemon"]
let Reel2 = ["lemon", "apple", "lemon", "lemon", "cherry", "apple", "banana", "lemon"]
let Reel3 = ["apple", "apple", "lemon", "apple", "cherry", "lemon", "banana", "lemon"]

res.json(scan_results(Reel1,Reel2,Reel3))

/* Output 

[
    
 {"coin":0,"spin_results":"cherry,lemon,apple"}
,{"coin":10,"spin_results":"2 apple"}
,{"coin":0,"spin_results":"apple,lemon,lemon"}
,{"coin":0,"spin_results":"banana,lemon,apple"}
,{"coin":40,"spin_results":"2 cherry"}
,{"coin":0,"spin_results":"banana,apple,lemon"}
,{"coin":5,"spin_results":"2 banana"}
,{"coin":3,"spin_results":"3 lemon"}

]
*/

});

app.listen(3001,()=>{
     console.log("serving at http://localhost:3001")
})



/////// Game Logic ////////

interface Result {
   spin_results? :string, 
   coin?:number
}


function scan_results(reel1:string[],reel2:string[],reel3:string[]):Result[]{
    let result :Result = {} 
    let results :Result[] = []

    for (let i = 0; i < reel1.length; i++) {
        if(reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "cherry"){
            //50 coins
            result.coin = 50
            result.spin_results = "3 cherry"
        }else if(reel1[i] == reel2[i] && reel1[i] == "cherry"   || reel2[i] == reel3[i] && reel2[i] == "cherry"  ){
            //40 coins
            result.coin = 40
            result.spin_results = "2 cherry"
        }else if(reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "apple"){
            // 20 coins
            result.coin = 20
            result.spin_results = "3 apple"
        }else if(reel1[i] == reel2[i] && reel1[i] == "apple"   || reel2[i] == reel3[i] && reel2[i] == "apple" ){
            // 10 coins 
            result.coin = 10
            result.spin_results = "2 apple"
        }else if(reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "banana"){
            // 15 coins
            result.coin = 15
            result.spin_results = "3 banana"
        }else if(reel1[i] == reel2[i] && reel1[i] == "banana"   || reel2[i] == reel3[i] && reel2[i] == "banana"){
            // 5 coins
            result.coin = 5
            result.spin_results = "2 banana"
        }else if(reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "lemon"){
             // 3 coins
             result.coin = 3
             result.spin_results = "3 lemon"
        }else{
            result.coin = 0
            result.spin_results = reel1[i]+","+reel2[i]+","+reel3[i]
        }
        results.push(result)
        result = {}
    }
    
    /*Rewards
        ● 3 cherries in a row: 50 coins, 2 cherries in a row: 40 coins
        ● 3 Apples in a row: 20 coins, 2 Apples in a row: 10 coins
        ● 3 Bananas in a row: 15 coins, 2 Bananas in a row: 5 coins
        ● 3 lemons in a row: 3 coins
    */
  return results
  
}