// a; // reserved
// b; // reserved
// c; // reserved
W=70; // main width
H=40; // main height
B=10; // block size

// M; // map field
// E; // enemies
// U; // user
// P; // user start position
// T; // user tail

D=Math; // alias
r=D.random; // alias
//R=D.round; // alias // now simple use ~~
m=D.min; // alias
I=parseInt; // alias

// i, j; // universal iterators
// k, x, y; // universal map indexes
// v; // universal vector

level=1;
lives=3;
timer=0;

_s="fillStyle";
_r="fillRect";
_l="length";


//W=11;
//H=10;

c.width=W*B;
c.height=H*B;

P = I(H*W*0.5+W*0.5);

function startLevel()
{
	M=[];
	E=[];
	generateMap();
	ll=lives;
	while(ll--)
		drawBlock(W-5-2*ll, 3)
	la=level;
	while(la--)
		drawBlock(la+5, 2)
	U = { // user
		t:0,
		c:4,
		k:P,
		v:~~(r()*4)+1
	};
	T = [];
	addTail(5);
	placeApple();
}

function addTail(sections)
{
	var last_section_position = (T[_l] == 0) ? U.k : T[T[_l]-1];
	while (sections--)
	{
		T.push(last_section_position);
	}
}

function placeApple()
{
	var apple_position;
	while (M[apple_position = ~~(r() * W * H)] != 2);
	drawBlock(apple_position, M[apple_position] = 5);
}

function shrinkTail(sections)
{
	while (sections--)
	{
		var section_position = T.pop();
		drawBlock(section_position, M[section_position] = 2);
	}
	drawBlock(T[T[_l]-1], 3);
}

function moveUser()
{
	var tail_length = T[_l];
	var x = T[_l] - 1;
	drawBlock(T[x], M[T[x]] = 2);
	while (tail_length--)
	{
		T[tail_length] = (tail_length-1 >= 0) ? T[tail_length-1] : U.k;
		drawBlock(T[tail_length], M[T[tail_length]] = 3);
	}

	v = U.v;
	// 0 - stop, 1 - left, 2 - up, 3 - right, 4 - down
	k = U.k + ((v-1) * (v-3) ? (v - 3) * W : v - 2);
	if (M[k] == 0 || M[k] == 3)
	{
		lives--;
		if (lives>0) {
			startLevel();
		} else {
			clearInterval(timer);
			a[_s]="white";
			a[_s]="red",a[_r](0,0,W*B,H*B);
			a[_s]="red",a.font="50px Arial",a.fillText("You have died of dysentery",225,200);
		}
	}
	else
	{
		if (M[k] == 5)
		{
			addTail(3);
			placeApple();
		}
		M[k] = 2;
		drawBlock(U.k = k, U.c);
		if(T[_l]>49) {
			startLevel(++level);
		}
	}
}

function generateMap() {
	i = W * H + 1;
	while (i--)
	{
		y = I((i-1) / W);
		y = m(H-y, y+1);

		x = i % W;
		x = m(x, W+1-x);
		j = m(x,y);
		k = j > 3 ? 2 : 0;
		drawBlock(i, M[i] = k);
	}
}

function togglePause(){
	if (!timer){
		timer = setInterval(function(){
			moveUser();
			/*for(i in E) {
				moveEnemy(E[i]);
			}*/
		}, 150/level);
	}else{
		clearInterval(timer);
		timer=0;
	}
}

function drawBlock(index, color)
{
	// black -- border -- 000000 (000) -- #0
	// gray -- land -- 999999 (999) -- #1
	// blue -- water -- 0033ff (03f) -- #2
	// yellow -- path	-- ffff00 (ff0) --3
	// green -- player -- 339900 (390) --#4
	// red -- AI -- ff0000 (f00) -- #5

	var colors = {
		0:'000',
		1:'999',
		2:'03f',
		3:'ff0',
		4:'390',
		5:'f00',
		9:'fff'
	};
	
	a[_s] = "#"+colors[I(color)];

	x = index % W ? index % W : W; // probably we don't need to check X to be zero. it's border there and we don't need to draw border actually
	y = I((index-1) / W);
	a[_r]((x-1)*B,y*B,B,B);
}


startLevel();

document.onkeydown = function(e) {
	kc=e.keyCode
	if (36<kc && kc<41)
		U.v = kc-36;
	if (kc == 32)
		togglePause();
	if (kc == 78)
	{
		clearInterval(timer),togglePause(timer=0);
		startLevel(level=1,lives=3);
	}
}

togglePause();
