import {HydratedDocument} from "mongoose";
import {IUser, User} from "../../models";
import {signToken, verifyPassword} from "../../utils";


export const login = async (parent, args: {username: string, password: string}, context) =>{
	const {username, password}: {username: string, password: string} = args;

	const result: HydratedDocument<IUser> = await User.findOne({username: username})
	if(!result){
		throw new Error("User not found")
	}

	const isValidPassword: boolean = await verifyPassword(result.password, password)
	if (!isValidPassword) {
		throw new Error("Invalid password");
	}

	const token = await signToken({userId: username})
	console.log(context.isAuth)
	context.res.cookie("auth", token, {
		httpOnly: true,
		expires: new Date(Date.now() + 900000),
		sameSite: true
	})

	return result
}