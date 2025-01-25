/** @type {import('tailwindcss').Config} */
const generateCarouselSafelist = (maxItems) => { //tailwindcss不支持动态类名类似w-[{test}] 通过safelist强制支持
    const safelist = [];

    // 动态生成宽度类名
    safelist.push(`w-[${maxItems * 100}%]`);

    // 动态生成 translate-x 的位移类名
    for (let i = 0; i < maxItems; i++) {
        safelist.push(`translate-x-[-${i * 100}%]`);
    }

    return safelist;
};
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // 添加你的文件路径，确保 IntelliSense 知道从哪里查找类
    ],
    theme: {
      extend: {
        boxShadow:{
            'thick': '0 0 8px rgb(160, 160, 160)',
        },
        spacing:{
            '18': '4.5rem',
        },
        width:{
            '108': '27rem',
        },
      },
    },
    plugins: [],
    safelist: generateCarouselSafelist(20), //现在carousel支持20个
};