package util;

use 5.010;
use strict;
use warnings;
use Exporter qw(import);

our @EXPORT_OK      = qw(installFile installPackageSuite runCmd runSteps
    LOGDEBUG LOGINFO LOGWARN LOGERR info);
our %EXPORT_TAGS    = (logging => [qw(LOGDEBUG LOGINFO LOGWARN LOGERR info)]);

use constant {
    LOGDEBUG  => 1,
    LOGINFO   => 2,
    LOGWARN   => 3,
    LOGERR    => 4,
};

our $verbose        = LOGINFO;
our $dryrun         = 1;
our $defaultRetry   = 2;

sub installFile
{
    my $path        = shift;
    my $content     = shift;
    my $FL;

    return 0 if $dryrun;

    open($FL, '>', $path);
    print $FL $content;
    close $FL;
    return 0;
}

sub setLogLevel
{
    $verbose = shift;
}

sub info
{
    my $msg     = shift;
    my $level   = shift || LOGINFO;

    return if ($verbose > $level);
    say "[MONICAKE] $msg";
}

sub runCmd
{
    my $cmd = shift;
    if ($verbose >= LOGINFO) { $cmd .= " >/dev/null"; }

    info "Run command:\n$cmd", LOGDEBUG;
    return 0 if $dryrun;

    my $ret = system($cmd);
    if ($ret){
        info "Return code is $ret", LOGDEBUG;
    }

    return $ret;
}


my %suites = (
    "zabbix-agent"      => ['zabbix-agent'],
    "zabbix-server"     => ['zabbix-server-mysql', 'zabbix-frontend-php', 'php5-mysql']
);

sub installPackageSuite
{
    my $packageSuite    = shift;
    my $packageManager  = getPackageManager();
    return 1 unless $packageManager;

    my $packageInstall  = $$packageManager{install};

    unless(exists $suites{$packageSuite}){
        info("Package suite $packageSuite not supported.");
        exit(4);
    }

    my $packagesRef = $suites{$packageSuite};
    my $packageLine = join(" ", @$packagesRef);
    my $cmd = "$packageInstall $packageLine";
    info "Begin install packages:$packageLine", LOGDEBUG;
    my $ret = runCmd($cmd);
    if (!$ret){
        info("Install succeed.", LOGDEBUG);
    }else{
        info("Install failed. Try update.", LOGDEBUG);
        my $packageUpdate = $$packageManager{refresh};
        runCmd($packageUpdate);
        my $ret = runCmd($cmd);
        if (!$ret){
            info("Install succeed.", LOGDEBUG);
        }else{
            info("Install failed.", LOGDEBUG);
        }
    }

    return $ret;
}

sub getPackageManager()
{
    my %pm  = (
        aptitude    => {
            install => "DEBIAN_FRONTEND=noninteractive apt-get -y install",
            refresh => "apt-get update"
        },
        yum         => {
            install => "yum -y install",
            refresh => "rpm -q zabbix-release || rpm -ivh http://repo.zabbix.com/zabbix/2.4/rhel/7/x86_64/zabbix-release-2.4-1.el7.noarch.rpm"
        }
    );

    return $pm{aptitude}    unless runCmd('which apt-get 2> /dev/null');
    return $pm{yum}         unless runCmd('which yum 2> /dev/null');

    info("Package manager not supported.", LOGERR);
    exit(3);
}

sub runSteps
{
    my $steps   = shift;
    my $len     = @$steps;
    my $index   = 0;
    foreach my $step (@$steps){
        ++$index;
        info "($index/$len) $$step{name}";
        my $run = $$step{run};
        my $ret = &$run;
        my $retry = $defaultRetry;
        while ($ret && $retry){
            info "failed with code: $ret, $retry retries remaining.";
            --$retry;
            $ret = &$run;
        }

        if ($ret){
            info "failed with code: $ret";
            exit(2);
        }
    }
}

1;
