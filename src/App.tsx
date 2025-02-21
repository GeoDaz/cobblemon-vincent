import { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './components/ui/table';
import users from './json/usercache.json';
import Spinner from './components/ui/spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWebAwesome } from '@fortawesome/free-solid-svg-icons';

const usersData = () =>
	Promise.all(
		users.map(async user => {
			const data = await import(`./json/cobblemonplayerdata/${user.uuid}.json`);
			return {
				name: user.name,
				uuid: user.uuid,
				nbCatches: Object.keys(data.extraData.cobbledex_discovery.registers)
					.length,
				wins: data.advancementData.totalPvPBattleVictoryCount,
				topCatches: false,
				topWins: false,
			};
		})
	).then(data => {
		const maxCatches = Math.max(...data.map(user => user.nbCatches));
		const maxWins = Math.max(...data.map(user => user.wins));
		return data
			.map(user => ({
				...user,
				topCatches: user.nbCatches === maxCatches ? true : false,
				topWins: user.wins === maxWins ? true : false,
			}))
			.sort((u1, u2) => u2.nbCatches - u1.nbCatches);
	});

function App() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		usersData().then(users => {
			setUsers(users);
			setLoading(false);
		});
	}, []);

	return (
		<div className="app dark:bg-gray-950 text-white p-4 flex justify-center ">
			{loading ? (
				<Spinner />
			) : (
				<Table className="table-auto w-115">
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Nom</TableHead>
							<TableHead className="text-left">Nb captures</TableHead>
							<TableHead className="text-left">Victoires PVP</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="">
						{users.map(user => (
							<TableRow
								key={user.uuid}
								className={
									user.topCatches
										? 'text-yellow-500'
										: user.topWins
										? 'text-orange-500'
										: ''
								}
							>
								<TableCell className="text-left">{user.name}</TableCell>
								<TableCell className="text-right">
									{user.topCatches && (
										<>
											<FontAwesomeIcon icon={faWebAwesome} />{' '}
										</>
									)}{' '}
									{user.nbCatches}
								</TableCell>
								<TableCell className="text-right">
									{user.topWins && (
										<>
											<FontAwesomeIcon icon={faWebAwesome} />{' '}
										</>
									)}{' '}
									{user.wins}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}

export default App;
