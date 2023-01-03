let first = true;
// 正在进行的workHook
let workHook = null;
let firstHook = null;
let nextHook = null;
let componentUpdateQueue = null;
function is(x, y) {
	return (
		(x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
	);
}
function areHookInputsEqual(nextDeps,prevDeps) {
	if (prevDeps === null) {
		return false;
	}
	for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
		if (is(nextDeps[i], prevDeps[i])) {
			continue;
		}
		return false;
	}
	return true;
}
function createFunctionComponentUpdateQueue () {
	return {
		lastEffect: null,
	}
}

const {useState} = React;
function myState(initialState){
	if(first){
		return mountState(initialState);
	}else{
		return updateState(initialState);
	}
}

function createNewHook(){
	const hook = {
		memoizedState: null,
		queue: null,
		next: null,
	};
	if (workHook === null) {
		firstHook = workHook = hook;
	} else {
		workHook = workHook.next = hook;
	}
	return workHook;
}

function updateHook(){
	if(nextHook !== null){
		workHook = nextHook;
		nextHook = workHook.next;
	}
	const newHook = workHook;
	if (workHook === null) {
		firstHook = workHook = newHook;
	}
	return newHook;
}

function dispatchSetState(queue,action){
	const update = {
		action,
		next:null
	}
	const last = queue.last;
	if(last === null){
		update.next = update;
	}else{
		const first = last.next;
		if(first !== null){
			update.next = first;
		}
		last.next = update;
	}
	queue.last = update;
}

function mountState(initialState){
	let hook = createNewHook();
	hook.memoizedState = initialState;
	const queue = {
		last:null,
		dispatch: null,
	};
	hook.queue = queue;
	const dispatch= (queue.dispatch = (dispatchSetState.bind(
		null,
		queue,
	)));
	return [hook.memoizedState, dispatch];
}

function updateState(){
	const hook = updateHook();
	const queue = hook.queue;
	const last = queue.last;
	const first = last !== null ? last.next : null;
	if(first !== null){
		let newState;
		let update = first;
		do{
			const action = update.action;
			newState = action;
			update = update.next;
		}while(update !== null && update !== first);
		hook.memoizedState = newState;
	}
	const dispatch = queue.dispatch;
	return [hook.memoizedState, dispatch];
}


// effect
function myEffect(create,deps){
	if(first){
		return mountEffect(create,deps)
	}else{
		return updateEffect(create,deps)
	}
}

function pushEffect(tag,create, destroy, deps) {
	const effect = {
		tag,
		create,
		destroy,
		deps,
		next: null,
	};
	if (componentUpdateQueue === null) {
		componentUpdateQueue = createFunctionComponentUpdateQueue();
		componentUpdateQueue.lastEffect = effect.next = effect;
	} else {
		const lastEffect = componentUpdateQueue.lastEffect;
		if (lastEffect === null) {
			componentUpdateQueue.lastEffect = effect.next = effect;
		} else {
			const firstEffect = lastEffect.next;
			lastEffect.next = effect;
			effect.next = firstEffect;
			componentUpdateQueue.lastEffect = effect;
		}
	}
	return effect;
}

function mountEffect(create,deps){
	const hook = createNewHook();
	const nextDeps = deps === undefined ? null : deps;
	hook.memoizedState = pushEffect('UpdateEffect',create, undefined, nextDeps);
}

function updateEffect(create,deps){
	const hook = updateHook();
	const nextDeps = deps === undefined ? null : deps;
	let destroy = undefined;
	if (hook !== null) {
		const prevEffect = hook.memoizedState;
		destroy = prevEffect.destroy;
		if (nextDeps !== null) {
			const prevDeps = prevEffect.deps;
			if (areHookInputsEqual(nextDeps, prevDeps)) {
				pushEffect('noHook',create, destroy, nextDeps);
				return;
			}
		}
	}
	hook.memoizedState = pushEffect('UpdateEffect',create, destroy, nextDeps);
}

function runMyEffect () {
	if(componentUpdateQueue !== null){
		const first = componentUpdateQueue.lastEffect;
		if(first !== null){
			let queue = first;
			do{
				if(queue.tag !== 'noHook'){
					queue.create();
				}
				queue = queue.next;
			}while(queue !== null && queue !== first);
		}
	}
	componentUpdateQueue = null;
}






























const App = () => {
	const [num,setNum] = myState(0);
	const [num1,setNum1] = myState(1);
	const [num2,setNum2] = myState(2);
	const [next,setNext] = useState(1);
	myEffect(() => {
		console.log('初始化运行一次')
	},[])
	myEffect(() => {
		console.log(num,'myEffect-num')
	},[num])
	myEffect(() => {
		console.log(num1,'myEffect-num1')
	},[num1])
	const onClick = () => {
		setNum(0);
		setNum1(1);
		setNum2(2);
		setNext(next+1);
	}
	const numAdd = () => {
		setNum(num+1);
		setNext(next+1);
	}
	const num1Add = () => {
		setNum1(num1+1);
		setNext(next+1);
	}
	const num2Add = () => {
		setNum2(num2+1);
		setNext(next+1);
	}
	runMyEffect();
	first = false;
	nextHook = firstHook;
	// console.log(componentUpdateQueue,'componentUpdateQueue')
	// console.log(firstHook,'firstHook')
	return(
		<div>
			<button onClick={numAdd}>
				num + 1
			</button>
			<button onClick={num1Add}>
				num1 + 1
			</button>
			<button onClick={num2Add}>
				num2 + 1
			</button>
			<button onClick={onClick}>
				重置
			</button>
			<div>num：{num}</div>
			<div>num1：{num1}</div>
			<div>num2：{num2}</div>
		</div>
	)
}
ReactDOM.render(
  <App />,
  document.getElementById("root")
);
