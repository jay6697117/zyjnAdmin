/*
 * 系统登录模块
 */
const data = {
  'code': 0,
  'msg': null,
  'data': []
}
// 登录
export const login = () => {
  let record = {
    'token_type': 'Bearer',
    'expires_in': 172800,
    'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNiNTQyZTc0ZTRiZjU4ZjE5Mjg2MzY3OGU4MzI4NWM1MjJkYTQ0ZjY0NGIxOWJiYzU0NTk0OTQ2MzIxNGY0NzE1ZTRhYmViNTE5NTY5ZGYwIn0.eyJhdWQiOiI1IiwianRpIjoiM2I1NDJlNzRlNGJmNThmMTkyODYzNjc4ZTgzMjg1YzUyMmRhNDRmNjQ0YjE5YmJjNTQ1OTQ5NDYzMjE0ZjQ3MTVlNGFiZWI1MTk1NjlkZjAiLCJpYXQiOjE1NjA0MDg2NDksIm5iZiI6MTU2MDQwODY0OSwiZXhwIjoxNTYwNTgxNDQ5LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.nvvYGvIK8QRPtjPGTi2Nfsp6hL26_tDgR9vzDOoPYQ8okreUI_MYfmSlVizHKoSRMu5MWgANU-hJE2ZKaPLO27QyYzXsotYXAjVcT_5Kh2DmW_c6T3_1vkow_wK3cGr1-WEBjFFhHGyjnt_LAB76yPhZhrw1yPKCvrPNVuoJi-74iLs8EIYqB73SA-CNOjCU_5u6hqxYx0siysSiV-XwM49TfdTtxV_iS7D8YSv1aG6zrG6PQjAcNJBkw7hA9poPYu9qDvMWn8UsjShcDS5WyW3w4yce7rie-AQ2enY4WM5MrCFrUQUl_RnAzPhwr5yTUCqiCTdDnhQYjhwbYdVU0PMHER15_j5guVNHcQ4lgGBweYBfh6wMsSnxPQHyswrnxqv3jD4zvMm6Ye0bhqNoylLu28UOdKO98zGV62RFMZ63eL928NfScSAlfj9rpHoj44p6iohVtaGxWs_zwg096qUUweX7ZD2whAUm-VIiki7C07Kznn_v6Gd89AUgjll_fbPJR4v1rMffRexVRs33-2LpRxZttrRRuTaTuLmIR3lH5OQaILvAgaOds9ubntGKyxEZBI_W0OHIom3v0LzHzPDENe0jLM1H-Tvu8svvSr8qzPtnr1XAStHRUwl9780Z4vCjFMHXjZJRBIVSiF0jjcWnoeD5mC4LHJtvVNL3Lx8',
    'refresh_token': 'def502008c69c916e020fb082242420ee51fb69b8df869c49c0e2f7448a8f52740d5257cd29e5db806def141cc3b38bf8d9b2044c3b5e04e12e6c515a7752abc6b48e969f404b2fb9bd1ab22fd77f64104ea15c94bd56174e594180879f664f6293c136c2df4fb62f46ee0e25353180e8985a82ec5ec9ef025da60d865a35fc24e1c80c67325a6e389e9dd0b4b18bf1e56a735cd539ffed2405ffdb9ba4ddcaa95e7e34057deeb092c8c53df595ac0625a544d1fad2cd4071f691d4366d738c96b5fa301c47c5522cbda7b262358ab3f9b817535173b53440adace19871bbba9c26f935af4ae2e2905cf87c6e592b72d1f423ca63cf051bac62ed6768fbfe6bffa4d48dff1345e6e2e47565bc944d4633bf975ff4374cb8786f725518e6d3ff8973e83dd7ca292f70be263c5224660dcd1595d3eac819f0cc32c273385d3786bf070ea548d8e33d6010f42e2020957b4cdaf41191204c92e0d678e42d1006e96fbee'
  }
  return {
    url: '/oauth/token',
    data: record
  }
}

// 登出
export const logout = () => {
  let record = {
    'code': 401,
    'msg': '请重新登录',
    'data': []
  }
  return {
    url: '/user/logout',
    type: 'post',
    data: record
  }
}

// 获取图片验证码
export const getCaptcha = () => {
  let record = {
    'code': 0,
    'msg': 'ok',
    'data': {
      'key': '$2y$10$AbK1qwLAK98z7hBPlhngyeQD/CIFvmLDSOAUzBSgAFQSsWXYuhXHq',
      'img': 'data:image/png;base64,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'
    }
  }
  return {
    url: '/captcha/get',
    data: record
  }
}

// 获取短信验证码
export const getMessage = () => {
  return {
    url: '/sms/send-code',
    data
  }
}

// 完成忘记密码
export const submitForget = () => {
  return {
    url: '/user/forget-password-modify',
    data
  }
}
