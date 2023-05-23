import dynamic from "next/dynamic";

const HomeDynamic = dynamic(import("../components/Home/index"),{
    ssr:false
})
export default HomeDynamic