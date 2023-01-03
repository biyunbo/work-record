const {useState} = React;

let workHook = null;
let first = true;
let nextHook = null;
let firstHook = null;

function createNewHook(){
	const hook = {
		memoizedState:null,
		queue:null,
		next:null
	}
	if(workHook === null){
		firstHook = workHook = hook;
	}else{
		workHook = workHook.next = hook;
	}

	return hook;
}

function updateHook () {
	if(nextHook !== null){
		workHook = nextHook;
		nextHook = workHook.next;
	}
	const newHook = workHook;

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
	const hook = createNewHook();
	hook.memoizedState = initialState;
	const queue = {
		last:null,
		dispatch:null
	}
	hook.queue = queue;

	const dispatch = queue.dispatch = dispatchSetState.bind(null,queue);
	return [hook.memoizedState,dispatch]
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
	return  [hook.memoizedState,dispatch]
}


function myState (initialState) {
	if(first){
		return mountState(initialState);
	}else{
		return updateState(initialState);
	}
}








const App = () => {
	const [num,setNum] = myState(0);
	const [num1,setNum1] = myState(1);
	const [next,setNext] = useState(1);

	const onClick = () => {
		setNum(0);
		setNum1(1);
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

	first = false;
	nextHook = firstHook;
	return(
		<div>
			<button onClick={numAdd}>
				num + 1
			</button>
			<button onClick={num1Add}>
				num1 + 1
			</button>
			<button onClick={onClick}>
				重置
			</button>
			<div>num：{num}</div>
			<div>num1：{num1}</div>
		</div>
	)
}
ReactDOM.render(
  <App />,
  document.getElementById("root")
);
