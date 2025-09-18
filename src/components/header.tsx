import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlaceHolderImages } from "@/lib/placeholder-images"

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const userAvatar = PlaceHolderImages.find((p) => p.id === "user-avatar")

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary"
        >
          <path
            d="M16 2.66663C13.6811 2.66663 11.4638 3.33353 9.55585 4.58023C7.64791 5.82694 6.13071 7.59962 5.20417 9.6806C4.27763 11.7616 3.98822 14.0535 4.38171 16.2755C4.7752 18.4975 5.83158 20.5578 7.39341 22.1196C8.95523 23.6814 11.0155 24.7378 13.2375 25.1313C15.4595 25.5248 17.7514 25.2354 19.8324 24.3088C21.9134 23.3823 23.6861 21.8651 24.9328 19.9571C26.1795 18.0492 26.8464 15.8319 26.8464 13.513"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.2428 7.34668C21.7511 8.24231 22.9806 9.54452 23.8248 11.121C24.669 12.6975 25.1016 14.4849 25.0864 16.3005C25.0712 18.116 24.6087 19.8893 23.7439 21.4637C22.879 23.0381 21.6401 24.3639 20.1246 25.313"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.4839 12.25C14.151 11.8335 14.9213 11.5646 15.7339 11.4667C16.5464 11.3687 17.3712 11.4447 18.148 11.6882C18.9248 11.9317 19.6315 12.3368 20.2178 12.8727C20.8041 13.4086 21.2558 14.0601 21.5419 14.7833"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.1509 17.0333C10.818 16.6169 11.5883 16.348 12.4008 16.25C13.2133 16.152 14.0382 16.228 14.815 16.4715C15.5917 16.715 16.2985 17.1202 16.8848 17.656C17.4711 18.1919 17.9228 18.8434 18.2089 19.5666"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="font-headline text-xl font-bold">PeacePod</h1>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  {userAvatar && (
                    <AvatarImage
                      src={userAvatar.imageUrl}
                      alt={userAvatar.description}
                      data-ai-hint={userAvatar.imageHint}
                    />
                  )}
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
