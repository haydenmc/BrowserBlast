using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace BrowserBlast.Hubs
{
	public class GameHub : Hub
	{
		public void Hello()
		{
			Clients.All.hello();
			
		}
	}
}