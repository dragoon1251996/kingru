'use strict';
var fs = require("fs");
var MeCab = new require('mecab-async'),
  mecab = new MeCab();
var pos = {
  "名詞": "N",
  "動詞": "V",
  "連体詞": "A",
  "形容詞": "A"
}
var key_regex = JSON.parse(fs.readFileSync('key_regex.json'));
var key_grammar= JSON.parse(fs.readFileSync('key_grammar.json'));
var score= JSON.parse(fs.readFileSync('score.json'));
function pronouce(str) {
  if (str == null)
    return "*"
  return str
}

function token(text) {
  var token = []
  for (var i of mecab.parseSync(text)) {
    token.push([i[0], pronouce(pos[i[1]])])
  }
  return token
}

function findE(arr,S){
  for (var i of arr){
    if(S.endsWith(i[0])==true){
      return i[1]
    }
  }
  return false;
}

function findS(arr,S){
  for (var i of arr){
    if(S.startsWith(i[0])==true){
      return i[1]
    }
  }
  return false
}

function match(t1,t2){
  if (t1=='*') return true
  if (t1==t2) return true
  return false
}

function match_form(tok, sentence,form){
  var key=[]
  for ( var z of form){
    for (var i of  z){
      var k=sentence.split(i[0])
      var status=false
      for( var j=0;j<k.length-1;j=j+1){
        if(findE(tok,k[j])!=false && findS(tok,k[j+1])!=false && match(i[1],findE(tok,k[j]))==true && match(i[2],findS(tok,k[j+1]))==true){
          status=true
        }
      }
      key.push(status)
    }
    for(var s of key){
      if(s == false) return false
    }
  }
  return true
}

function sort_score(ids){
  var id=[]
  for (var i of ids){
    id.push([score[i],i])
  }
  return id.sort().reverse()
}

function Grammar_Sentence(text){
  var text=text.replace(" ","").replace("\n","")
  var g=[]
  var tok=token(text)
  var temp=[]
  for ( var i in key_regex){
    if(text.match(i)!=null){
      temp=temp.concat(key_regex[i])
    }
  }
  temp=new Set(temp)
  for (i of temp){
    if(match_form(tok,text,key_grammar[i])==true){
      g.push(i)
    }
  }
  return sort_score(g)
}
// console.log(token(    "「イグ・ノーベル賞」は、アメリカの科学雑誌が１９９１年から面白い研究を選んで贈っている賞です。今年は、長野県駒ヶ根市にある病院で医者をしている堀内朗さんがこの賞をもらいました。日本人は、この賞を１２年続けてもらっています。堀内さんは、大腸を見るカメラを座ったまま自分で尻から入れて検査をすることができるかどうか調べました。そして論文に、簡単にできたと書きました。１３日、アメリカのハーバード大学で賞を贈る式がありました。堀内さんが白衣を着て、手を動かしながらカメラの入れ方を説明すると、会場にいた人たちは大きな声を出して笑いました。堀内さんは、楽にカメラを入れる方法を見つけるために研究をしたと話しました。そして、「賞をもらって驚いています。多くの人が検査を受けて、大腸のがんで亡くなる人が少なくなってほしいと思います」と話しました。"
// ));
for (var i =0;i<1000;i++){
  console.log(i)
  console.log(Grammar_Sentence(
    "「イグ・ノーベル賞」は、アメリカの科学雑誌が１９９１年から面白い研究を選んで贈っている賞です。今年は、長野県駒ヶ根市にある病院で医者をしている堀内朗さんがこの賞をもらいました。日本人は、この賞を１２年続けてもらっています。堀内さんは、大腸を見るカメラを座ったまま自分で尻から入れて検査をすることができるかどうか調べました。そして論文に、簡単にできたと書きました。１３日、アメリカのハーバード大学で賞を贈る式がありました。堀内さんが白衣を着て、手を動かしながらカメラの入れ方を説明すると、会場にいた人たちは大きな声を出して笑いました。堀内さんは、楽にカメラを入れる方法を見つけるために研究をしたと話しました。そして、「賞をもらって驚いています。多くの人が検査を受けて、大腸のがんで亡くなる人が少なくなってほしいと思います」と話しました。"

))
}
