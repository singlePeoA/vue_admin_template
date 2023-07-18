// 这个文件重要用于获取当前时间，并且根据当前时间判断 上午|中午|下午|晚上
export const getTime = () => {
  let message = " "
  const hours = new Date().getHours()
  if (hours <= 11) {
    message = "上午"
  } else if (hours >= 11 && hours <= 13) {
    message = "中午"
  } else if (hours >= 13 && hours <= 18) {
    message = "下午"
  } else if (hours >= 18) {
    message = "晚上"
  }
  return message
}
