import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ProductItem from './ProductItem.jsx';
import ProductsList from './ProductsList.jsx';
import ProductItemContainer from './ProductItemContainer.jsx';
import * as ShopActions from '../actions/ShopActions';

/*
@resolve("fuckme", function( params, store ) {


	let { dispatch } = params;

	console.log( '拿到 dispatch: ', dispatch )
	debugger;

	// return Promise.resolve('dddd')

	// double destructruing
	// 先解出 customProps, 再解出 store
	// let {customProps:{store}} = params;
	// let store = data;

	// 先檢查是否已撈過該筆資料，沒有的話才回 server 取
	// if( store.getState().products.$fetched == true ) return callback();

	// 然後接上 redux 系統的 action/reducer 操作，撈回資料後會觸發 view 更新
	// 最棒的是這招在 server rendering 時也同樣有效，它會等到 data fetching 完成才繪出並返還頁面
	dispatch( ShopActions.readAll() )
									.then( result => callback(),
										   err => callback(err) );

  // const { user } = params;
  // const url = `https://api.github.com/users/${user}`;
  // return axios.get(url)
		// 	  .then(({ data }) => data);


})*/


class ProductsContainer extends Component {

	static needs = [
		ShopActions.readAll
	];

	// 重要，props 包含 dispatch fn 與所有 reducers 物件，是由 @connect 傳入的
	// dispatch: function
	// products: Record
	// carts: Record
	constructor(props, context) {
		super(props, context);
		this.actions = bindActionCreators(ShopActions, props.dispatch);
	}

	componentWillMount() {
		let { params, dispatch } = this.props;
		ProductsContainer.needs.map( need => dispatch(need(params)) )
	}

	render() {

	  let products = this.props.products;

	  // if( !products ) debugger;

	  // 重要：將 Immutable.Map 轉成 Sequence (類似 [ ReactElement, ReactElement, ReactElement])
	  var nodes = products.productsById.valueSeq().map( product => {
		return <ProductItemContainer
				  key={product.id}
				  product={product}
				  onAddToCart={this.actions.addToCart} />;
	  });

	  return (
		<ProductsList title="Flux Shop Demo (Redux)" key="productList">
		  {nodes}
		</ProductsList>
	  );
	}

};

// 使用 connect 精準獲取這個 view 需要的資料源，如此可減少日後不必要的 redraw
export default connect( (state, ownProps) => ({ products: state.products }) )(ProductsContainer);
