const {useState} = React;

let workHook = null;
let firstHook = null;
let first = true;
let nextHook = null;

function myState(initialState){
	if(first){
		// 初始化
		return mountState(initialState)
	}else{
		// 更新
		return updateState(initialState)
	}
}

function createNewHook () {
	// hook数据结构
	const hook = {
		memoizedState: null,//初始值
		queue: null,//队列
		next: null,//下一个hook
	};

	//当前是否有正在运行的hook
	if (workHook === null) {
		// 没有的话，这个hook就是第一个，并且设置为正在工作的hook
		firstHook = workHook = hook;
	} else {
		// 有的话，将正在工作的hook的下一个设置为这个hook,并且把它定义成正在工作的hook
		workHook = workHook.next = hook;
	}
	return workHook;
}

function updateHook () {
	// 存在下一个hook
	if(nextHook !== null){
		workHook = nextHook;
		nextHook = workHook.next;
	}

	const newHook = workHook;

	// // 正在进行的hook不存在
	// if (workHook === null) {
	// 	firstHook = workHook = newHook;
	// }
	return newHook;
}

function dispatchSetState (queue,action){
	// 使用数据结构存储所有的更新行为，以便在 rerender 流程中计算最新的状态值
	const update = {
		action, // 状态值
		next:null // 下一个update
	}
	// 取出下一个更新逻辑
	const last = queue.last;
	if(last === null){
		// 如果不存在，当前的下一个就是他本身
		update.next = update;
	}else{
		// 取出第一个更新逻辑
		const first = last.next
		if(first !== null){
			// 当前这个更新逻辑的下一个，就是第一个
			update.next = first;
		}
		// 下一个
		last.next = update;
	}
	// 下一个更新逻辑替换
	queue.last = update;
}

function mountState(initialState) {
	const hook = createNewHook();
	hook.memoizedState = initialState;
	// 修改状态的队列
	const queue = {
		last:null, // 下一个更新的逻辑
		dispatch:null // 修改状态的方法
	}
	hook.queue = queue;

	// 通过闭包的方式，实现队列在不同函数中的共享。前提是每次用的 dispatch 函数是同一个
	const dispatch = queue.dispatch = (dispatchSetState.bind(
		null,
		queue,
	));
	return [hook.memoizedState,dispatch]
}

function updateState(){
	const hook = updateHook();
	// 取出更新队列
	const queue = hook.queue;
	// 取出下一个更新逻辑
	const last = queue.last;
	// 第一个更新逻辑
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
