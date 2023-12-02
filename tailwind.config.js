/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*{.html,.ts,.tsx}"],
   theme: {
      extend: {
         ringColor: {
            "chakra-focus": "rgba(66,153,225,0.6)",
         },
      },
   },
   plugins: [],
};
