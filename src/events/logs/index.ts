import ban from "./ban";
import join from "./join";
import role from "./role";
import channel from "./channel";
import invite from "./invite";
import server from "./server";

export default [...ban, ...role, ...invite, ...join, ...channel, ...server];
