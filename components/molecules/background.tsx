// https://ui.aceternity.com/components/grid-and-dot-backgrounds
export const DotBackground = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex">
			{/* Radial gradient for the container to give a faded look */}
			<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_80%,black)]" />
			{children}
		</div>
	)
}
