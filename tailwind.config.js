/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*{.html,.ts,.tsx}"],
   theme: {
      extend: {
         backgroundColor: {
            "chakra-active": "rgb(255,255,255,.16)",
            "chakra-active-dark": "rgb(237,242,247,.16)",
            "chakra-hover": "rgb(255,255,255,.1)",
            "chakra-hover-dark": "rgb(237,242,247,.1)",
         },
         ringColor: {
            "chakra-focus": "rgba(66,153,225,0.6)",
         },
      },
   },
   plugins: [],
};
