import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
	const {model, date, license, qty, content} = req.body

	try {
		await prisma.note.create({
			data: {
				model,
                date,
                license,
                qty,
				content
			}
		})
		res.status(200).json({message: 'Note Created'})
	} catch (error) {
		console.log("Failure");
	}
}