import { ArrayConverter } from 'typedoc/dist/lib/converter/types'
import axios from '../../src/index'

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: ['bar', 'baz']
//   }
// })

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: {
//       bar: 'baz'
//     }
//   }
// })

// const date = new Date()

// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     date
//   }
// })


// axios({
//   method: 'get',
//   url: '/base/get?foo=bar',
//   params: {
//     bar: 'baz'
//   }
// })
console.log('base');

axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  },
}).then(res => {
  console.log(res);
})


axios({
  method: 'post',
  url: '/base/post',
  responseType: 'json',
  data: {
    a: 1,
    b: 2
  },
}).then(res => {
  console.log(res);
})




// const arr = new Int32Array([21, 31])

// axios({
//   method: 'post',
//   url: '/base/buffer',
//   data: arr
// })

// axios({
//   method: 'post',
//   url: '/base/post',
//   headers: {
//     'content-type': 'application/json',
//     'Accept': 'application/json, text/plain, */*'
//   },
//   data: {
//     a: 1,
//     b: 2
//   }
// })
