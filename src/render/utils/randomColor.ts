export const randomColor = () => {
    let color = "#";
    let arr = ['6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    for (let i = 0; i < 3; i++) {
        color += Math.floor(Math.random()*10)
    }
    return color;
}
